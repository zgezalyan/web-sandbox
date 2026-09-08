import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Field } from "../components";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={(event) => void onSubmit(event)}>
        <p className="eyebrow">Web Sandbox</p>
        <h1>Sign in to the bench</h1>
        <p className="lede">Open the HTTP client, JSON lab, playground, and the rest of the toolkit.</p>
        {error ? <p className="alert">{error}</p> : null}
        <Field label="Email">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label="Password">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </Field>
        <button type="submit">Enter</button>
        <p className="auth-foot">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
