import { useEffect, useState } from "react";
import Button from "@visa/nova-react/button";
import GiveKudosDialog from "../components/kudos/GiveKudosDialog";
import KudosCard from "../components/kudos/KudosCard";
import { useAuth } from "../context/useAuth";
import api, { getApiError } from "../lib/api";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState("");
  const { user, refreshUser } = useAuth();
  const receivedKudos = feed.filter(
    (kudos) => (kudos.receiver?._id || kudos.receiver?.id) === user?.id,
  ).length;
  const displayUser = user || {};
  const nextResetDate = getNextResetDate();

  async function loadFeed() {
    try {
      const response = await api.get("/kudos", { params: { limit: 50 } });
      setFeed(response.data.data.kudos);
      setError("");
    } catch (requestError) {
      setFeed([]);
      setError(getApiError(requestError));
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function handleKudosSent() {
    await loadFeed();
    await refreshUser?.();
  }

  return (
    <div>
      <section className="welcome-card">
        <p className="small-title">Kudos Dashboard</p>
        <h1>Welcome back, {displayUser.name || "Heer"}</h1>
        <p>Recognize your teammates and appreciate their work.</p>
        <p className="reset-text">Next points reset: {nextResetDate}</p>
      </section>

      <div className="simple-grid mt-4">
        <div className="card">
          <h3>Giving Allowance</h3>
          <p>
            {displayUser.givingAllowance ?? 70} /{" "}
            {displayUser.allowanceTotal ?? 100}
          </p>
          <small>Points left this month</small>
        </div>

        <div className="card">
          <h3>Earned Points</h3>
          <p>{displayUser.earnedPoints ?? 0}</p>
          <small>Total points received</small>
        </div>

        <div className="card">
          <h3>Kudos Received</h3>
          <p>{receivedKudos}</p>
          <small>This month</small>
        </div>
      </div>

      {displayUser.role !== "admin" && (
        <div className="mt-5">
          <Button
            className="primary-button"
            type="button"
            onClick={() => setShowForm(true)}
          >
            Give Kudos
          </Button>
        </div>
      )}

      <section className="card mt-5">
        <h2>My Points</h2>
        <div className="summary-list">
          <p>
            <strong>Giving Allowance:</strong>{" "}
            {displayUser.givingAllowance ?? 70} /{" "}
            {displayUser.allowanceTotal ?? 100}
          </p>
          <p>
            <strong>Earned Points:</strong> {displayUser.earnedPoints ?? 0}
          </p>
          <p>
            <strong>Kudos Received:</strong> {receivedKudos}
          </p>
        </div>
        <p className="help-text">
          Giving points are points you can give to others. Earned points are
          points you have received.
        </p>
      </section>

      <section className="card mt-5">
        <h2>Recent Kudos</h2>
        {error && <p className="danger-text">{error}</p>}
        {feed.length === 0 && <p className="empty-text">No kudos found.</p>}

        {feed.map((kudos) => (
          <KudosCard key={kudos._id || kudos.id} kudos={kudos} />
        ))}
      </section>

      <GiveKudosDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSent={handleKudosSent}
      />
    </div>
  );
}

function getNextResetDate() {
  const today = new Date();
  const nextMonth = today.getMonth() + 1;
  const nextReset = new Date(today.getFullYear(), nextMonth, 1);

  return nextReset.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default Dashboard;
