import Image from 'next/image';
import { WHO_TO_FOLLOW } from "@/services/mockData";

export default function WhoToFollow() {
  return (
    <div className="bg-gray-900 rounded-2xl mt-4">
      <h2 className="font-bold text-xl px-4 pt-3 pb-2">Who to follow</h2>
      <div>
        {WHO_TO_FOLLOW.map((user) => (
          <div 
            key={user.id} 
            className="px-4 py-3 hover:bg-white/[0.03] transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                <Image
                  src={user.avatar}
                  alt="User avatar"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <p className="font-bold text-base">{user.name}</p>
                <p className="text-gray-500 text-sm">@username</p>
              </div>
            </div>
            <button className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm hover:bg-white/90">
              Follow
            </button>
          </div>
        ))}
        <button className="w-full text-left px-4 py-4 text-brand hover:bg-white/[0.03] transition rounded-b-2xl">
          Show more
        </button>
      </div>
    </div>
  );
} 