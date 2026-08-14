
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const EVENT_IMAGES = {
  food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=85",
  music: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
  sports: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85",
  general: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
  tech: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
};

const initialEvents = [
  {
    id: 1,
    title: "Food Festival",
    description:
      "Discover local flavours, international cuisine and unforgettable culinary experiences.",
    icon: "🍴",
    image: EVENT_IMAGES.food,
    date: "2026-10-10",
    location: "Kathmandu",
    capacity: 300,
    price: 15,
    category: "Food",
  },
  {
    id: 2,
    title: "Rock Concert",
    description:
      "Experience an unforgettable night of live rock music, energy and entertainment.",
    icon: "🎸",
    image: EVENT_IMAGES.music,
    date: "2026-10-20",
    location: "Kathmandu",
    capacity: 500,
    price: 25,
    category: "Music",
  },
  {
    id: 3,
    title: "Football Championship",
    description:
      "Watch top teams compete in an exciting championship experience.",
    icon: "⚽",
    image: EVENT_IMAGES.sports,
    date: "2026-10-25",
    location: "Kathmandu",
    capacity: 1000,
    price: 20,
    category: "Sports",
  },
  {
    id: 4,
    title: "Technology Summit",
    description:
      "Connect with innovators and explore the future of technology.",
    icon: "💻",
    image: EVENT_IMAGES.tech,
    date: "2026-11-05",
    location: "Kathmandu",
    capacity: 250,
    price: 30,
    category: "Technology",
  },
];

function App() {
  const [page, setPage] = useState("login");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [events, setEvents] = useState(initialEvents);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  /* SEARCH AND FILTER */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventIcon, setEventIcon] = useState("🎉");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("eventifyDarkMode") === "true"
  );

  const [notifications, setNotifications] = useState(
    localStorage.getItem("eventifyNotifications") !== "false"
  );

  const [activeStatus, setActiveStatus] = useState(
    localStorage.getItem("eventifyActiveStatus") !== "false"
  );

  const [profile, setProfile] = useState({
    firstName: "Pritima",
    lastName: "Timalsina",
    username: "admin",
    email: "pritima@example.com",
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("eventifyDarkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("eventifyNotifications", notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("eventifyActiveStatus", activeStatus);
  }, [activeStatus]);

  const dashboardStats = useMemo(
    () => ({
      events: events.length,
      registrations: registeredEvents.length,
      attendees: registeredEvents.length,
      categories: new Set(events.map((event) => event.category)).size,
    }),
    [events, registeredEvents]
  );

  /* SEARCH + CATEGORY FILTER */
  const categories = [
    "All",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      event.title.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search) ||
      event.location.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("token", "demo-token");
      setProfile((prev) => ({ ...prev, username: "admin" }));
      setPage("dashboard");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token || "login-token");
        setPage("dashboard");
      } else {
        alert(data.message || "Invalid username or password.");
      }
    } catch {
      alert(
        "Server login unavailable.\n\nDemo Login:\nUsername: admin\nPassword: admin123"
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      alert("Password should contain at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            username: signupUsername,
            email,
            password: signupPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Account created successfully!");

      setProfile({
        firstName,
        lastName,
        username: signupUsername,
        email,
      });

      setUsername(signupUsername);
      setPassword("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setSignupUsername("");
      setSignupPassword("");
      setConfirmPassword("");
      setPage("login");
    } catch {
      setProfile({
        firstName,
        lastName,
        username: signupUsername,
        email,
      });

      setUsername(signupUsername);
      setPassword("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setSignupUsername("");
      setSignupPassword("");
      setConfirmPassword("");

      alert("Account created successfully!");
      setPage("login");
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem("token", "google-demo-token");
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  const openEvent = (event) => {
    setSelectedEvent(event);
    setPage("details");
  };

  const bookEvent = (event) => {
    const exists = registeredEvents.some(
      (item) => item.id === event.id
    );

    if (exists) {
      alert("You have already booked this event.");
      setPage("registrations");
      return;
    }

    setSelectedEvent(event);
    setPage("booking");
  };

  const confirmBooking = (event) => {
    const alreadyBooked = registeredEvents.some(
      (item) => item.id === event.id
    );

    if (alreadyBooked) {
      alert("This event is already in your registrations.");
      setPage("registrations");
      return;
    }

    setRegisteredEvents((prev) => [...prev, event]);
    setSelectedEvent(event);
    setPage("confirmation");
  };

  const cancelRegistration = (eventId) => {
    setRegisteredEvents((prev) =>
      prev.filter((event) => event.id !== eventId)
    );

    alert("Registration cancelled successfully.");
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (
      !eventTitle ||
      !eventDescription ||
      !eventDate ||
      !eventLocation ||
      !eventCapacity ||
      !eventPrice
    ) {
      alert("Please complete all event details.");
      return;
    }

    if (Number(eventCapacity) <= 0) {
      alert("Capacity must be greater than 0.");
      return;
    }

    if (Number(eventPrice) < 0) {
      alert("Ticket price cannot be negative.");
      return;
    }

    const image =
      eventIcon === "🍴"
        ? EVENT_IMAGES.food
        : eventIcon === "🎸"
        ? EVENT_IMAGES.music
        : eventIcon === "⚽"
        ? EVENT_IMAGES.sports
        : eventIcon === "💻"
        ? EVENT_IMAGES.tech
        : EVENT_IMAGES.general;

    const category =
      eventIcon === "🍴"
        ? "Food"
        : eventIcon === "🎸"
        ? "Music"
        : eventIcon === "⚽"
        ? "Sports"
        : eventIcon === "💻"
        ? "Technology"
        : "General";

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      description: eventDescription,
      icon: eventIcon,
      image,
      date: eventDate,
      location: eventLocation,
      capacity: Number(eventCapacity),
      price: Number(eventPrice),
      category,
    };

    setEvents((prev) => [...prev, newEvent]);

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify({
          name: eventTitle,
          description: eventDescription,
          date: eventDate,
          location: eventLocation,
          category,
          capacity: Number(eventCapacity),
          price: Number(eventPrice),
          image,
        }),
      });
    } catch {
      console.log("Event saved locally.");
    }

    setEventTitle("");
    setEventDescription("");
    setEventDate("");
    setEventLocation("");
    setEventCapacity("");
    setEventPrice("");
    setEventIcon("🎉");

    alert("Event created successfully.");
    setPage("events");
  };

  const saveProfile = (e) => {
    e.preventDefault();
    alert("Profile updated successfully.");
    setPage("profile");
  };

  const Navbar = () => (
    <nav className="navbar">
      <button
        className="brand-button"
        onClick={() => setPage("dashboard")}
      >
        <span className="brand-mark">E</span>
        <span className="brand-name">Eventify</span>
      </button>

      <div className="nav-right">
        <button
          className="nav-icon-button"
          onClick={() => setPage("profile")}
          title="My Profile"
        >
          👤
        </button>

        <button
          className="nav-icon-button"
          onClick={() => setPage("settings")}
          title="Settings"
        >
          ⚙️
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-section-title">Workspace</div>

      <button
        className={
          page === "dashboard" ? "side-item active" : "side-item"
        }
        onClick={() => setPage("dashboard")}
      >
        <span>⌂</span> Dashboard
      </button>

      <button
        className={
          page === "events" ? "side-item active" : "side-item"
        }
        onClick={() => setPage("events")}
      >
        <span>🎫</span> Events
      </button>

      <button
        className={
          page === "registrations"
            ? "side-item active"
            : "side-item"
        }
        onClick={() => setPage("registrations")}
      >
        <span>📋</span> My Bookings
      </button>

      <button
        className={
          page === "attendees" ? "side-item active" : "side-item"
        }
        onClick={() => setPage("attendees")}
      >
        <span>👥</span> Attendees
      </button>

      <button
        className={
          page === "create-event"
            ? "side-item active"
            : "side-item"
        }
        onClick={() => setPage("create-event")}
      >
        <span>＋</span> Create Event
      </button>

      <div className="sidebar-divider" />

      <div className="sidebar-section-title">Account</div>

      <button
        className={
          page === "profile" ? "side-item active" : "side-item"
        }
        onClick={() => setPage("profile")}
      >
        <span>👤</span> My Profile
      </button>

      <button
        className={
          page === "notifications"
            ? "side-item active"
            : "side-item"
        }
        onClick={() => setPage("notifications")}
      >
        <span>🔔</span> Notifications
        {notifications && <small className="notification-dot" />}
      </button>

      <button
        className={
          page === "settings" ? "side-item active" : "side-item"
        }
        onClick={() => setPage("settings")}
      >
        <span>⚙️</span> Settings
      </button>

      <div className="sidebar-user">
        <div className="avatar">
          {profile.firstName?.charAt(0) || "P"}
        </div>

        <div>
          <strong>
            {profile.firstName || "Pritima"}{" "}
            {profile.lastName || "Timalsina"}
          </strong>

          <span>
            {activeStatus ? "● Active now" : "○ Offline"}
          </span>
        </div>
      </div>
    </aside>
  );

  const Layout = ({ children }) => (
    <div className="app-shell">
      <Navbar />

      <div className="body-layout">
        <Sidebar />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );

  /* ===============================
     DASHBOARD
  =============================== */

  if (page === "dashboard") {
    return (
      <Layout>
        <section className="dashboard-header">
          <div>
            <span className="eyebrow dashboard-eyebrow">
              EVENT MANAGEMENT
            </span>
          </div>

          <button
            className="primary-button"
            onClick={() => setPage("create-event")}
          >
            + Create Event
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎫</div>

            <div>
              <span>Total Events</span>
              <strong>{dashboardStats.events}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>

            <div>
              <span>My Bookings</span>
              <strong>{dashboardStats.registrations}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>

            <div>
              <span>Attendees</span>
              <strong>{dashboardStats.attendees}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✨</div>

            <div>
              <span>Categories</span>
              <strong>{dashboardStats.categories}</strong>
            </div>
          </div>
        </section>

        <section className="section-heading">
          <div>
            <h2>Featured Events</h2>
            <p>Explore the latest experiences on Eventify.</p>
          </div>

          <button
            className="text-button"
            onClick={() => setPage("events")}
          >
            View all →
          </button>
        </section>

        <section className="event-grid dashboard-event-grid">
          {events.slice(0, 3).map((event) => (
            <article className="event-card" key={event.id}>
              <div className="event-card-image">
                <img
                  src={event.image}
                  alt={event.title}
                />

                <span className="category-badge">
                  {event.icon} {event.category}
                </span>
              </div>

              <div className="event-card-body">
                <h3>{event.title}</h3>

                <p className="event-description-short">
                  {event.description}
                </p>

                <div className="event-meta">
                  <span>
                    📅 {formatDate(event.date)}
                  </span>

                  <span>
                    📍 {event.location}
                  </span>
                </div>

                <div className="event-card-footer">
                  <strong>${event.price}</strong>

                  <button
                    className="small-primary-button"
                    onClick={() => openEvent(event)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </Layout>
    );
  }

  /* ===============================
     EVENTS
  =============================== */

  if (page === "events") {
    return (
      <Layout>
        <section className="page-header">
          <div>
            <span className="eyebrow">
              DISCOVER
            </span>

            <h1>Explore Events</h1>

            <p>
              Find experiences that match your interests.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => setPage("create-event")}
          >
            + Create Event
          </button>
        </section>

        {/* SEARCH AND FILTER */}
        <section className="event-filters">
          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {(searchTerm ||
            selectedCategory !== "All") && (
            <button
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </section>

        <section className="event-grid">
          {filteredEvents.length === 0 ? (
            <div className="empty-card">
              <div>🔍</div>

              <h2>No events found</h2>

              <p>
                Try another search term or category.
              </p>

              <button
                className="primary-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <article
                className="event-card"
                key={event.id}
              >
                <div className="event-card-image">
                  <img
                    src={event.image}
                    alt={event.title}
                  />

                  <span className="category-badge">
                    {event.icon} {event.category}
                  </span>
                </div>

                <div className="event-card-body">
                  <h3>{event.title}</h3>

                  <p className="event-description-short">
                    {event.description}
                  </p>

                  <div className="event-meta">
                    <span>
                      📅 {formatDate(event.date)}
                    </span>

                    <span>
                      📍 {event.location}
                    </span>

                    <span>
                      👥 {event.capacity} seats
                    </span>
                  </div>

                  <div className="event-card-footer">
                    <strong>
                      ${event.price}
                    </strong>

                    <button
                      className="small-primary-button"
                      onClick={() =>
                        openEvent(event)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </Layout>
    );
  }

  /* ===============================
     EVENT DETAILS
  =============================== */

  if (page === "details" && selectedEvent) {
    return (
      <Layout>
        <button
          className="back-button"
          onClick={() => setPage("events")}
        >
          ← Back to Events
        </button>

        <div className="details-layout">
          <div className="details-image">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
            />
          </div>

          <div className="details-content">
            <span className="category-label">
              {selectedEvent.icon}{" "}
              {selectedEvent.category}
            </span>

            <h1>{selectedEvent.title}</h1>

            <p className="details-description">
              {selectedEvent.description}
            </p>

            <div className="details-info-grid">
              <div>
                <span>Date</span>
                <strong>
                  {formatDate(selectedEvent.date)}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {selectedEvent.location}
                </strong>
              </div>

              <div>
                <span>Capacity</span>
                <strong>
                  {selectedEvent.capacity} people
                </strong>
              </div>

              <div>
                <span>Ticket Price</span>
                <strong>
                  ${selectedEvent.price}
                </strong>
              </div>
            </div>

            <div className="booking-action">
              <div>
                <span>Starting from</span>

                <strong>
                  ${selectedEvent.price}
                </strong>
              </div>

              <button
                className="primary-button large-button"
                onClick={() =>
                  bookEvent(selectedEvent)
                }
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ===============================
     BOOKING
  =============================== */

  if (page === "booking" && selectedEvent) {
    return (
      <Layout>
        <button
          className="back-button"
          onClick={() => setPage("details")}
        >
          ← Back to Event
        </button>

        <div className="booking-page">
          <div className="booking-card">
            <div className="booking-title">
              <span className="eyebrow">
                SECURE BOOKING
              </span>

              <h1>
                Complete your booking
              </h1>

              <p>
                Review your event and payment details.
              </p>
            </div>

            <div className="booking-event">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
              />

              <div>
                <span>
                  {selectedEvent.category}
                </span>

                <h3>
                  {selectedEvent.title}
                </h3>

                <p>
                  📅 {formatDate(selectedEvent.date)}
                </p>

                <p>
                  📍 {selectedEvent.location}
                </p>
              </div>
            </div>

            <div className="payment-box">
              <div className="payment-row">
                <span>Ticket</span>

                <strong>
                  ${selectedEvent.price}
                </strong>
              </div>

              <div className="payment-row">
                <span>Service fee</span>

                <strong>$2</strong>
              </div>

              <div className="payment-row total-row">
                <span>Total</span>

                <strong>
                  ${selectedEvent.price + 2}
                </strong>
              </div>
            </div>

            <div className="payment-method">
              <h3>Payment Method</h3>

              <div className="payment-option selected">
                <span>💳</span>

                <div>
                  <strong>
                    Demo Card Payment
                  </strong>

                  <small>
                    Secure demo checkout
                  </small>
                </div>

                <span>✓</span>
              </div>
            </div>

            <button
              className="primary-button full-button"
              onClick={() =>
                confirmBooking(selectedEvent)
              }
            >
              Pay ${selectedEvent.price + 2} & Confirm Booking
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  /* ===============================
     CONFIRMATION
  =============================== */

  if (page === "confirmation" && selectedEvent) {
    return (
      <Layout>
        <div className="confirmation-page">
          <div className="confirmation-card">
            <div className="confirmation-check">
              ✓
            </div>

            <span className="eyebrow">
              BOOKING CONFIRMED
            </span>

            <h1>
              You're all set!
            </h1>

            <p>
              Your booking for{" "}
              <strong>
                {selectedEvent.title}
              </strong>{" "}
              has been successfully confirmed.
            </p>

            <div className="ticket">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
              />

              <div className="ticket-info">
                <span>Eventify Ticket</span>

                <h2>
                  {selectedEvent.title}
                </h2>

                <p>
                  📅 {formatDate(selectedEvent.date)}
                </p>

                <p>
                  📍 {selectedEvent.location}
                </p>

                <p>
                  🎫 Ticket confirmed
                </p>
              </div>

              <div className="ticket-price">
                <span>Paid</span>

                <strong>
                  ${selectedEvent.price + 2}
                </strong>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                className="primary-button"
                onClick={() =>
                  setPage("registrations")
                }
              >
                View My Bookings
              </button>

              <button
                className="secondary-button"
                onClick={() => setPage("events")}
              >
                Explore More Events
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ===============================
     BOOKINGS
  =============================== */

  if (page === "registrations") {
    return (
      <Layout>
        <section className="page-header">
          <div>
            <span className="eyebrow">
              YOUR ACTIVITY
            </span>

            <h1>
              My Bookings
            </h1>

            <p>
              Manage your upcoming Eventify bookings.
            </p>
          </div>
        </section>

        {registeredEvents.length === 0 ? (
          <div className="empty-card">
            <div>🎫</div>

            <h2>
              No bookings yet
            </h2>

            <p>
              Explore events and reserve your first
              experience.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setPage("events")
              }
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="booking-list">
            {registeredEvents.map((event) => (
              <div
                className="booking-list-card"
                key={event.id}
              >
                <img
                  src={event.image}
                  alt={event.title}
                />

                <div className="booking-list-info">
                  <span>
                    {event.category}
                  </span>

                  <h3>
                    {event.title}
                  </h3>

                  <p>
                    📅 {formatDate(event.date)}
                  </p>

                  <p>
                    📍 {event.location}
                  </p>
                </div>

                <div className="booking-list-status">
                  <span className="status-pill">
                    Confirmed
                  </span>

                  <strong>
                    ${event.price + 2}
                  </strong>

                  <button
                    className="danger-button"
                    onClick={() =>
                      cancelRegistration(event.id)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Layout>
    );
  }

  /* ===============================
     ATTENDEES
  =============================== */

  if (page === "attendees") {
    return (
      <Layout>
        <section className="page-header">
          <div>
            <span className="eyebrow">
              EVENT MANAGEMENT
            </span>

            <h1>
              Attendees
            </h1>

            <p>
              View registered attendees and booking status.
            </p>
          </div>
        </section>

        {registeredEvents.length === 0 ? (
          <div className="empty-card">
            <div>👥</div>

            <h2>
              No attendees yet
            </h2>

            <p>
              Attendee information will appear after bookings.
            </p>
          </div>
        ) : (
          <div className="attendee-table">
            <div className="table-header">
              <span>Attendee</span>
              <span>Event</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {registeredEvents.map((event) => (
              <div
                className="table-row"
                key={event.id}
              >
                <div className="attendee-name">
                  <div className="avatar small">
                    {profile.firstName.charAt(0)}
                  </div>

                  <strong>
                    {profile.firstName}{" "}
                    {profile.lastName}
                  </strong>
                </div>

                <span>
                  {event.title}
                </span>

                <span>
                  {formatDate(event.date)}
                </span>

                <span className="status-pill">
                  Registered
                </span>
              </div>
            ))}
          </div>
        )}
      </Layout>
    );
  }

  /* ===============================
     CREATE EVENT
  =============================== */

  if (page === "create-event") {
    return (
      <Layout>
        <button
          className="back-button"
          onClick={() => setPage("dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="form-page">
          <div className="form-header">
            <span className="eyebrow">
              EVENT MANAGEMENT
            </span>

            <h1>
              Create a new event
            </h1>

            <p>
              Publish a professional event on Eventify.
            </p>
          </div>

          <form
            className="professional-form"
            onSubmit={handleCreateEvent}
          >
            <div className="form-grid">
              <div className="form-field full">
                <label>
                  Event Name
                </label>

                <input
                  value={eventTitle}
                  onChange={(e) =>
                    setEventTitle(e.target.value)
                  }
                  placeholder="e.g. Annual Music Festival"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) =>
                    setEventDate(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Location
                </label>

                <input
                  value={eventLocation}
                  onChange={(e) =>
                    setEventLocation(e.target.value)
                  }
                  placeholder="Kathmandu"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  value={eventCapacity}
                  onChange={(e) =>
                    setEventCapacity(e.target.value)
                  }
                  placeholder="500"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Ticket Price ($)
                </label>

                <input
                  type="number"
                  min="0"
                  value={eventPrice}
                  onChange={(e) =>
                    setEventPrice(e.target.value)
                  }
                  placeholder="25"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Category
                </label>

                <select
                  value={eventIcon}
                  onChange={(e) =>
                    setEventIcon(e.target.value)
                  }
                >
                  <option value="🎉">
                    🎉 General
                  </option>

                  <option value="🍴">
                    🍴 Food
                  </option>

                  <option value="🎸">
                    🎸 Music
                  </option>

                  <option value="⚽">
                    ⚽ Sports
                  </option>

                  <option value="💻">
                    💻 Technology
                  </option>
                </select>
              </div>

              <div className="form-field full">
                <label>
                  Description
                </label>

                <textarea
                  value={eventDescription}
                  onChange={(e) =>
                    setEventDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe your event..."
                  rows="5"
                  required
                />
              </div>
            </div>

            <button
              className="primary-button full-button"
              type="submit"
            >
              Publish Event
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  /* ===============================
     PROFILE
  =============================== */

  if (page === "profile") {
    return (
      <Layout>
        <section className="page-header">
          <div>
            <span className="eyebrow">
              ACCOUNT
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your Eventify account information.
            </p>
          </div>
        </section>

        <div className="profile-layout">
          <div className="profile-summary">
            <div className="profile-avatar">
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </div>

            <h2>
              {profile.firstName}{" "}
              {profile.lastName}
            </h2>

            <p>
              @{profile.username}
            </p>

            <span className="status-pill">
              {activeStatus
                ? "● Active"
                : "○ Offline"}
            </span>
          </div>

          <form
            className="professional-form"
            onSubmit={saveProfile}
          >
            <div className="form-grid">
              <div className="form-field">
                <label>
                  First Name
                </label>

                <input
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label>
                  Last Name
                </label>

                <input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label>
                  Username
                </label>

                <input
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              className="primary-button"
              type="submit"
            >
              Save Changes
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  /* ===============================
     NOTIFICATIONS
  =============================== */

  if (page === "notifications") {
    return (
      <Layout>
        <section className="page-header">
          <div>
            <span className="eyebrow">
              ACCOUNT
            </span>

            <h1>
              Notifications
            </h1>

            <p>
              Control how Eventify keeps you updated.
            </p>
          </div>
        </section>

        <div className="settings-card">
          <div className="setting-row">
            <div>
              <h3>
                Event Notifications
              </h3>

              <p>
                Receive updates about bookings,
                events and reminders.
              </p>
            </div>

            <button
              className={`toggle ${
                notifications ? "on" : ""
              }`}
              onClick={() =>
                setNotifications(!notifications)
              }
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <h3>
                Booking Updates
              </h3>

              <p>
                Get notified when your booking
                status changes.
              </p>
            </div>

            <button
              className={`toggle ${
                notifications ? "on" : ""
              }`}
              onClick={() =>
                setNotifications(!notifications)
              }
            >
              <span />
            </button>
          </div>

          <div className="notification-preview">
            <div className="notification-icon">
              🔔
            </div>

            <div>
              <strong>
                {notifications
                  ? "Notifications are enabled"
                  : "Notifications are disabled"}
              </strong>

              <p>
                {notifications
                  ? "You will receive Eventify updates."
                  : "You will not receive Eventify updates."}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ===============================
     SETTINGS
  =============================== */

  if (page === "settings") {
    return (
      <Layout>
        <section className="page-header">
          <div>
            <span className="eyebrow">
              PREFERENCES
            </span>

            <h1>
              Settings
            </h1>

            <p>
              Personalise your Eventify experience.
            </p>
          </div>
        </section>

        <div className="settings-card">
          <div className="settings-group">
            <h2>
              Appearance
            </h2>

            <div className="setting-row">
              <div>
                <h3>
                  Dark Mode
                </h3>

                <p>
                  Switch between light and dark interface themes.
                </p>
              </div>

              <button
                className={`toggle ${
                  darkMode ? "on" : ""
                }`}
                onClick={() =>
                  setDarkMode(!darkMode)
                }
              >
                <span />
              </button>
            </div>
          </div>

          <div className="settings-group">
            <h2>
              Privacy & Presence
            </h2>

            <div className="setting-row">
              <div>
                <h3>
                  Active Status
                </h3>

                <p>
                  Show whether you are currently active on Eventify.
                </p>
              </div>

              <button
                className={`toggle ${
                  activeStatus ? "on" : ""
                }`}
                onClick={() =>
                  setActiveStatus(!activeStatus)
                }
              >
                <span />
              </button>
            </div>
          </div>

          <div className="settings-group">
            <h2>
              Notifications
            </h2>

            <div className="setting-row">
              <div>
                <h3>
                  Push Notifications
                </h3>

                <p>
                  Receive important event and booking updates.
                </p>
              </div>

              <button
                className={`toggle ${
                  notifications ? "on" : ""
                }`}
                onClick={() =>
                  setNotifications(!notifications)
                }
              >
                <span />
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ===============================
     SIGN UP
  =============================== */

  if (page === "signup") {
    return (
      <div className="auth-page">
        <div className="auth-card signup-auth-card">
          <div className="auth-brand">
            <span className="brand-mark">
              E
            </span>

            <span>
              Eventify
            </span>
          </div>

          <h1>
            Create your account
          </h1>

          <p>
            Join Eventify and start discovering experiences.
          </p>

          <form onSubmit={handleSignup}>
            <div className="auth-two-column">
              <div className="form-field">
                <label>
                  First Name
                </label>

                <input
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  placeholder="First name"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Last Name
                </label>

                <input
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>
                Username
              </label>

              <input
                value={signupUsername}
                onChange={(e) =>
                  setSignupUsername(e.target.value)
                }
                placeholder="Choose username"
                required
              />
            </div>

            <div className="form-field">
              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-field">
              <label>
                Password
              </label>

              <div className="password-wrapper">
                <input
                  type={
                    showSignupPassword
                      ? "text"
                      : "password"
                  }
                  value={signupPassword}
                  onChange={(e) =>
                    setSignupPassword(e.target.value)
                  }
                  placeholder="Create password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowSignupPassword(
                      !showSignupPassword
                    )
                  }
                >
                  {showSignupPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>
                Confirm Password
              </label>

              <div className="password-wrapper">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            <button
              className="primary-button full-button"
              type="submit"
            >
              Create Account
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?

            <button
              onClick={() =>
                setPage("login")
              }
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===============================
     LOGIN
  =============================== */

  return (
    <div className="auth-page">
      <div className="auth-card login-auth-card">
        <div className="auth-brand large">
          <span className="brand-mark">
            E
          </span>

          <span>
            Eventify
          </span>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label>
              Username
            </label>

            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-field">
            <label>
              Password
            </label>

            <div className="password-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          <button
            className="primary-button full-button"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <div className="auth-divider">
          <span>
            OR
          </span>
        </div>

        <button
          className="google-button"
          onClick={handleGoogleLogin}
        >
          <strong>
            G
          </strong>

          Continue with Google
        </button>

        <div className="auth-switch">
          Don't have an account?

          <button
            onClick={() =>
              setPage("signup")
            }
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

