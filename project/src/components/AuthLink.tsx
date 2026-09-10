import { Link, useLocation, type LinkProps } from 'react-router-dom';

/**
 * Same as <Link>, but for /login and /signup it automatically remembers the
 * page the user was on as "backgroundLocation" in router state. App.tsx uses
 * that to keep rendering the current page (blurred) behind the auth card.
 */
export default function AuthLink({ to, children, state, ...rest }: LinkProps) {
  const location = useLocation();
  const currentState = location.state as { backgroundLocation?: typeof location } | null;

  const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';

  const backgroundLocation =
    currentState?.backgroundLocation ?? (isAuthPath ? undefined : location);

  return (
    <Link
      to={to}
      state={backgroundLocation ? { backgroundLocation, ...(state as object) } : state}
      {...rest}
    >
      {children}
    </Link>
  );
}
