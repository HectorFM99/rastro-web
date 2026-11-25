import { useCurrentUser } from "./CurrentUserContext";
import { USERS } from "./users";

// El desplegable "Soy...": simula quién está usando la web
export function UserSelector() {
  const { user, changeUser } = useCurrentUser();

  return (
    <>
      <label htmlFor="current-user">Soy</label>
      <select id="current-user" value={user.id} onChange={(e) => changeUser(e.target.value)}>
        {USERS.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </>
  );
}
