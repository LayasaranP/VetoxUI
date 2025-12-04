// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../api/auth/[...nextauth]/route";
 
// export default async function ProfilePage() {

//   const session = await getServerSession(authOptions);
 
//   if (!session) {
//     return <p>You must be signed in to view your profile.</p>;
//   }

//   alert("Welcome back, " + session.user.name);

 
//   return (
//     <div>
//       <h1>Hello, {session.user.name}</h1>
//       <p>Email: {session.user.email}</p>
//     </div>
//   );
// }