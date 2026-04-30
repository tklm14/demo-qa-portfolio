import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  validateEmail,
  validatePassword,
  authenticate,
  setAuth,
  clearAuth,
  isAuthenticated,
  requireAuth,
} from './auth'

describe('validateEmail', () => {
  it('空文字のとき未入力エラーを返す', () => {
    expect(validateEmail('')).toBe('メールアドレスを入力してください')
  })

  it('@がない場合は形式エラーを返す', () => {
    expect(validateEmail('noatsign')).toBe('正しい形式で入力してください')
  })

  it('ドメインがない場合は形式エラーを返す', () => {
    expect(validateEmail('test@')).toBe('正しい形式で入力してください')
  })

  it('スペースを含む場合は形式エラーを返す', () => {
    expect(validateEmail('te st@example.com')).toBe('正しい形式で入力してください')
  })

  it('正しい形式のとき null を返す', () => {
    expect(validateEmail('demo@example.com')).toBeNull()
  })
})

describe('validatePassword', () => {
  it('空文字のとき未入力エラーを返す', () => {
    expect(validatePassword('')).toBe('パスワードを入力してください')
  })

  it('値があるとき null を返す', () => {
    expect(validatePassword('Demo1234')).toBeNull()
  })
})

describe('authenticate', () => {
  it('正しい認証情報のとき true を返す', () => {
    expect(authenticate('demo@example.com', 'Demo1234')).toBe(true)
  })

  it('メールアドレスが違うとき false を返す', () => {
    expect(authenticate('wrong@example.com', 'Demo1234')).toBe(false)
  })

  it('パスワードが違うとき false を返す', () => {
    expect(authenticate('demo@example.com', 'wrongpass')).toBe(false)
  })

  it('両方違うとき false を返す', () => {
    expect(authenticate('wrong@example.com', 'wrongpass')).toBe(false)
  })
})

describe('setAuth / clearAuth / isAuthenticated', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('setAuth 後は isAuthenticated が true を返す', () => {
    setAuth()
    expect(isAuthenticated()).toBe(true)
  })

  it('clearAuth 後は isAuthenticated が false を返す', () => {
    setAuth()
    clearAuth()
    expect(isAuthenticated()).toBe(false)
  })

  it('何もセットしていないとき isAuthenticated は false を返す', () => {
    expect(isAuthenticated()).toBe(false)
  })
})

describe('requireAuth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('未ログイン状態のとき index.html にリダイレクトする', () => {
    // window.location.href への代入をモックする
    const hrefSetter = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      set href(url: string) { hrefSetter(url) },
    } as Location)

    requireAuth()

    expect(hrefSetter).toHaveBeenCalledWith('./index.html')
  })

  it('ログイン済みのときリダイレクトしない', () => {
    const hrefSetter = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      set href(url: string) { hrefSetter(url) },
    } as Location)

    setAuth()
    requireAuth()

    expect(hrefSetter).not.toHaveBeenCalled()
  })
})
