import { useEffect, useState } from "react";
import Button from "@visa/nova-react/button";
import RecognitionBadge from "../components/profile/RecognitionBadge";
import { currentUser } from "../data/mockData";
import { useAuth } from "../context/useAuth";
import api, { getApiError } from "../lib/api";

function Profile() {
  const { user, refreshUser } = useAuth();
  const displayUser = user || currentUser;
  const [avatar, setAvatar] = useState(displayUser.avatar || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [badges, setBadges] = useState([]);
  const [kudosFeed, setKudosFeed] = useState([]);
  const initials = displayUser.name?.trim().slice(0, 1).toUpperCase() || "H";
  const kudosGiven = kudosFeed.filter(
    (kudos) => (kudos.sender?._id || kudos.sender?.id) === user?.id,
  ).length;
  const kudosReceived = kudosFeed.filter(
    (kudos) => (kudos.receiver?._id || kudos.receiver?.id) === user?.id,
  ).length;

  useEffect(() => {
    if (!user?.id) return;

    api
      .get("/kudos", { params: { limit: 50 } })
      .then((response) => {
        const feed = response.data.data.kudos;
        setKudosFeed(feed);

        const receivedValues = feed
          .filter(
            (kudos) => (kudos.receiver?._id || kudos.receiver?.id) === user.id,
          )
          .map((kudos) => kudos.companyValue)
          .filter(Boolean);

        setBadges([...new Set(receivedValues)]);
      })
      .catch(() => setBadges([]));
  }, [user?.id]);

  async function saveAvatar(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api.patch("/users/me", { avatar: avatar.trim() || null });
      await refreshUser?.();
      setMessage("Profile picture updated.");
      setError("");
    } catch (requestError) {
      if (requestError.message === "Backend API is not connected yet.") {
        setMessage("Profile picture saved in demo mode.");
        setError("");
      } else {
        setError(getApiError(requestError));
        setMessage("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-heading">
        <h1>Profile</h1>
        <p>Your recognition summary.</p>
      </div>

      <section className="card mt-4 profile-card">
        {displayUser.avatar ? (
          <img
            className="profile-avatar"
            src={displayUser.avatar}
            alt={`${displayUser.name}'s avatar`}
          />
        ) : (
          <div className="profile-avatar">{initials}</div>
        )}
        <h2>{displayUser.name}</h2>
        <p>{displayUser.department}</p>
        <p>{displayUser.email}</p>

        <form className="mt-5" onSubmit={saveAvatar}>
          <label className="label" htmlFor="avatar-url">
            Profile picture URL
          </label>
          <input
            className="field"
            id="avatar-url"
            type="url"
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
          <Button
            className="primary-button mt-3"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save profile picture"}
          </Button>
        </form>
        {message && <p className="success-text mt-3">{message}</p>}
        {error && <p className="danger-text mt-3">{error}</p>}
      </section>

      <section className="simple-grid mt-4">
        <div className="card">
          <h3>Giving Allowance</h3>
          <p>
            {displayUser.givingAllowance ?? 70} /{" "}
            {displayUser.allowanceTotal ?? 100}
          </p>
        </div>
        <div className="card">
          <h3>Earned Points</h3>
          <p>{displayUser.earnedPoints ?? 0}</p>
        </div>
        <div className="card">
          <h3>Kudos Given</h3>
          <p>{kudosGiven}</p>
        </div>
        <div className="card">
          <h3>Kudos Received</h3>
          <p>{kudosReceived}</p>
        </div>
      </section>

      <section className="card mt-4">
        <h2>Recognition Badges</h2>
        <ul>
          {badges.length === 0 && <li>No recognition badges yet.</li>}
          {badges.map((badge) => (
            <RecognitionBadge key={badge} badge={badge} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Profile;
