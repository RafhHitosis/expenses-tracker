import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export function getExpenses(userId, callback) {
  const expenseRef = ref(database, `expenses/${userId}`);
  return onValue(expenseRef, (snapshot) => {
    const data = snapshot.val();
    const list = data
      ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
      : [];
    callback(list);
  });
}
