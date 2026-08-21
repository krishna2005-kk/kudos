import { useState } from 'react'
import Button from '@visa/nova-react/button'
import { useAuth } from '../context/AuthContext'
import api, { getApiError } from '../lib/api'

function Profile() {
  const { user, refreshUser } = useAuth()
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const initials = user?.name?.trim().slice(0, 1).toUpperCase() || '?'

  async function saveAvatar(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await api.patch('/users/me', { avatar: avatar.trim() || null })
      await refreshUser()
      setMessage('Profile picture updated.')
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError))
      setMessage('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1>Profile</h1>

      <section className="card mt-4">
        <div className="profile-header">
          {user?.avatar ? <img className="profile-avatar" src={user.avatar} alt={`${user.name}'s avatar`} /> : <div className="profile-avatar" aria-label="Profile avatar">{initials}</div>}
          <div>
            <p><strong>{user?.name}</strong></p>
            <p>{user?.email}</p>
            <p>{user?.department}</p>
          </div>
        </div>

        <form className="mt-5" onSubmit={saveAvatar}>
          <label className="label" htmlFor="avatar-url">Profile picture URL</label>
          <input
            className="field"
            id="avatar-url"
            type="url"
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
          <p className="mt-2">Paste an image URL, or clear it to use your initials.</p>
          <Button className="primary-button mt-3" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile picture'}
          </Button>
        </form>
        {message && <p className="success-text mt-3">{message}</p>}
        {error && <p className="danger-text mt-3">{error}</p>}
      </section>

      <section className="card mt-4">
        <p>Giving Points: {user?.givingAllowance ?? 'Not available'}</p>
        <p>Earned Points: {user?.earnedPoints ?? 0}</p>
      </section>

    </div>
  )
}

export default Profile
