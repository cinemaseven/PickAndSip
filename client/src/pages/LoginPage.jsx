import { useState } from "react"
import { authenticate } from "../api/httpApi"
import logoDark from "../assets/logo-dark.svg"

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async event => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
        const credentials = await authenticate(username, password)
        sessionStorage.setItem("pick-and-sip-auth", credentials)
        onLogin()
    } catch (requestError) {
        setError(
        requestError.message === "401 Unauthorized"
            ? "Incorrect username or password."
            : "Unable to sign in. Please try again."
        )
    } finally {
        setLoading(false)
    }
    }

    return (
    <main className="login-page">
        <section className="login-card">
        <img src={logoDark} alt="Pick & Sip" className="login-logo" />

        <div className="login-heading">
            <h1>Welcome to Pick & Sip</h1>
            <p>Enter your username and password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="login-username">Username</label>
            <input
            id="login-username"
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
            autoComplete="username"
            required
            />

            <label htmlFor="login-password">Password</label>
            <input
            id="login-password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>
        </section>
    </main>
    )
}
