import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Field } from "../components";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await register(email, username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register");
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={(event) => void onSubmit(event)}>
        <p className="eyebrow">Web Sandbox</p>
        <h1>Create a bench account</h1>
        <p className="lede">Registration stores a hashed password in SQLite and issues an HTTP-only session cookie.</p>
        {error ? <p className="alert">{error}</p> : null}
        <Field label="Email">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label="Username">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            maxLength={32}
            required
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </Field>
        <button type="submit">Create account</button>
        <p className="auth-foot">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
