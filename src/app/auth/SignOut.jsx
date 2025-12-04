import React from 'react'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { signOut } from '../store/userSlice';
import { useDispatch } from 'react-redux';

const SignOut = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const handleSignOut = () => {
      dispatch(signOut({
          user_id: '',
          name: '',
          email: '',
          isLoggedIn: false
      }));
      localStorage.removeItem("vetox_user");
      localStorage.removeItem("vetox_user_time");
      router.push('/'); 
    };

  return (
    <div>
      <div className="flex gap-2 mt-3">
            <button onClick={handleSignOut} className="flex-1 flex items-center justify-center gap-2 p-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
              <LogOut size={14} /> Sign out
            </button>
      </div>
    </div>
  )
}

export default SignOut
