

## Notices (Firestore)

The Notice page reads the `notices` collection. If it is empty or unreachable, the built-in notices in `src/data/notices.ts` are shown instead.

| field      | type                    | notes                                   |
| ---------- | ----------------------- | --------------------------------------- |
| `title`    | string                  | required                                |
| `body`     | string                  | required                                |
| `category` | `fee` \| `rule` \| `service` | defaults to `rule`                 |
| `pinned`   | boolean                 | pinned notices are shown first          |
| `date`     | Timestamp or ISO string | optional; newest first among the rest   |

Suggested Firestore rules: `notices` read-only for everyone; `orders` and `subscribers` create-only.

```
match /notices/{id}     { allow read: if true; allow write: if false; }
match /orders/{id}      { allow create: if true; allow read, update, delete: if false; }
match /subscribers/{id} { allow create: if true; allow read, update, delete: if false; }
```

## Scripts

`npm run dev` · `npm run build` · `npm run typecheck`
