// 民杰云营主流程 e2e：启动 → 首页 → 用户信息 → 提示 → 请求 → 跳日志 → 日志增删
// 运行前提：微信开发者工具已登录，project.config.json 的 appid 为有权限的 AppID（touristappid 无法打开项目）
const { test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const automator = require('miniprogram-automator')

const PROJECT = process.env.MP_PROJECT || path.resolve(__dirname, '../..')
// 只还原本测试真正 mock 过的方法：对未 mock 的方法调用 restoreWxMethod 会把它还原成 undefined
const mocked = new Set()
let mp

// 被 mock 的 wx 方法把调用参数记到 getApp().__calls，测试再读出来断言。
// 函数体在小程序运行时执行，只能通过额外参数拿到方法名与预设结果；传进来的 opts 已剥掉回调，
// 回调由开发者工具按返回值驱动：errMsg 含 ":fail" 走 fail，否则走 success，两者都会调 complete
async function mock(name, { result, error } = {}) {
  mocked.add(name)
  await mp.mockWxMethod(name, function () {
    // 额外参数追加在调用实参之后；wx.hideLoading() 这类无参调用时不存在 opts，故从末尾取
    const n = arguments.length
    const [method, preset, failure] = [arguments[n - 3], arguments[n - 2], arguments[n - 1]]
    const opts = n > 3 ? arguments[0] : undefined
    const app = getApp()
    app.__calls = app.__calls || []
    app.__calls.push({ name: method, title: opts && opts.title, url: opts && opts.url })
    return failure || preset || { errMsg: method + ':ok' }
  }, name, result || null, error || null)
}

const calls = () => mp.evaluate(() => getApp().__calls || [])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

before(async () => {
  mp = await automator.launch({ projectPath: PROJECT })
})

after(async () => {
  if (mp) await mp.close()
})

beforeEach(async () => {
  for (const name of mocked) await mp.restoreWxMethod(name)
  mocked.clear()
  await mp.evaluate(() => { getApp().__calls = []; getApp().globalData.userInfo = null })
  await mp.callWxMethod('removeStorageSync', 'logs')
})

test('启动后首页渲染标题、logo 与四项特性，tabBar 两项可用', async () => {
  const page = await mp.reLaunch('/pages/index/index')
  await page.waitFor('.title')
  assert.equal(page.path, 'pages/index/index')
  assert.equal(await (await page.$('.title')).text(), '欢迎使用民杰云营')
  assert.equal(await (await page.$('.logo')).attribute('src'), '/images/logo.png')
  const features = await Promise.all((await page.$$('.feature-text')).map((el) => el.text()))
  assert.deepEqual(features, ['完整的项目结构', '常用工具函数', '示例页面和组件', '规范的代码风格'])
  const logs = await mp.switchTab('/pages/logs/logs')
  assert.equal(logs.path, 'pages/logs/logs')
  const home = await mp.switchTab('/pages/index/index')
  assert.equal(home.path, 'pages/index/index')
})

test('获取用户信息成功后展示昵称并隐藏按钮', async () => {
  await mock('getUserProfile', { result: { userInfo: { nickName: '测试用户', avatarUrl: '/images/logo.png' } } })
  const page = await mp.reLaunch('/pages/index/index')
  await page.waitFor('.btn-primary')
  await (await page.$('.card .btn-primary')).tap()
  await page.waitFor('.user-name')
  assert.equal(await (await page.$('.user-name')).text(), '测试用户')
  assert.equal((await page.data()).hasUserInfo, true)
})

test('获取用户信息失败给出提示且保持未登录态', async () => {
  await mock('getUserProfile', { error: { errMsg: 'getUserProfile:fail auth deny' } })
  await mock('showToast')
  const page = await mp.reLaunch('/pages/index/index')
  await page.waitFor('.btn-primary')
  await (await page.$('.card .btn-primary')).tap()
  await sleep(300)
  assert.ok((await calls()).some((c) => c.name === 'showToast' && c.title === '获取用户信息失败'))
  assert.equal((await page.data()).hasUserInfo, false)
})

test('显示提示按钮弹出成功 toast', async () => {
  await mock('showToast')
  const page = await mp.reLaunch('/pages/index/index')
  await page.waitFor('.btn-warning')
  await (await page.$('.btn-warning')).tap()
  await sleep(300)
  assert.ok((await calls()).some((c) => c.name === 'showToast' && c.title === '这是一个提示'))
})

for (const [label, opt, toast] of [
  ['成功', { result: { statusCode: 200, data: {} } }, '请求成功'],
  ['失败', { error: { errMsg: 'request:fail' } }, '请求失败,这是一个示例'],
]) {
  test(`测试请求${label}：加载框开关成对并给出对应提示`, async () => {
    for (const name of ['showLoading', 'hideLoading', 'showToast']) await mock(name)
    await mock('request', opt)
    const page = await mp.reLaunch('/pages/index/index')
    await page.waitFor('.action-list')
    const buttons = await page.$$('.action-list .btn')
    await buttons[2].tap()
    await sleep(300)
    const names = (await calls()).map((c) => c.name)
    assert.ok(names.includes('showLoading') && names.includes('hideLoading'), names.join(','))
    assert.ok((await calls()).some((c) => c.name === 'showToast' && c.title === toast))
  })
}

test('查看日志按钮跳到日志 tab（回归：tabBar 页不能用 navigateTo）', async () => {
  const page = await mp.reLaunch('/pages/index/index')
  await page.waitFor('.btn-secondary')
  await (await page.$('.btn-secondary')).tap()
  await sleep(500)
  assert.equal((await mp.currentPage()).path, 'pages/logs/logs')
})

test('日志页：空态 → 添加两条 → 取消清空保留 → 确认清空回到空态', async () => {
  await mock('showToast')
  let page = await mp.reLaunch('/pages/logs/logs')
  await page.waitFor('.empty-state')
  assert.equal((await page.$$('.log-item')).length, 0)

  const addBtn = async () => (await page.$$('.action-bar .btn'))[0]
  await (await addBtn()).tap()
  await sleep(1100) // 两条日志时间戳至少相差 1 秒，确保格式化后可区分顺序
  await (await addBtn()).tap()
  await page.waitFor(300)
  const items = await page.$$('.log-item')
  assert.equal(items.length, 2)
  assert.equal(await (await page.$('.empty-state')), null)
  const times = await Promise.all((await page.$$('.log-time')).map((el) => el.text()))
  for (const t of times) assert.match(t, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  assert.ok(times[0] > times[1], `新日志应在最前：${times}`)
  assert.equal((await mp.callWxMethod('getStorageSync', 'logs')).length, 2)

  const clearBtn = async () => (await page.$$('.action-bar .btn'))[1]
  await mock('showModal', { result: { confirm: false, cancel: true } })
  await (await clearBtn()).tap()
  await page.waitFor(300)
  assert.equal((await page.$$('.log-item')).length, 2)

  await mock('showModal', { result: { confirm: true, cancel: false } })
  await (await clearBtn()).tap()
  await page.waitFor('.empty-state')
  assert.equal((await page.$$('.log-item')).length, 0)
  assert.equal(await mp.callWxMethod('getStorageSync', 'logs'), '')
  assert.ok((await calls()).some((c) => c.name === 'showToast' && c.title === '已清空'))
})

test('日志最多保留 50 条', async () => {
  const seed = Array.from({ length: 50 }, (_, i) => Date.UTC(2026, 0, 1) + i * 1000)
  await mp.callWxMethod('setStorageSync', 'logs', seed)
  await mock('showToast')
  const page = await mp.reLaunch('/pages/logs/logs')
  await page.waitFor('.log-item')
  assert.equal((await page.$$('.log-item')).length, 50)
  await (await page.$$('.action-bar .btn'))[0].tap()
  await page.waitFor(300)
  assert.equal((await mp.callWxMethod('getStorageSync', 'logs')).length, 50)
  assert.equal((await page.$$('.log-item')).length, 50)
})
