export default function TrendingTopics() {
  return (
    <div className="bg-gray-900 rounded-2xl mt-4">
      <h2 className="font-bold text-xl px-4 pt-3 pb-2">What&apos;s happening</h2>
      <div>
        {[1, 2, 3].map((trend) => (
          <div 
            key={trend} 
            className="px-4 py-3 hover:bg-white/[0.03] transition cursor-pointer"
          >
            <p className="text-gray-500 text-sm">Trending</p>
            <p className="font-bold text-base">#TrendingTopic{trend}</p>
            <p className="text-gray-500 text-sm">10.5K posts</p>
          </div>
        ))}
        <button className="w-full text-left px-4 py-4 text-brand hover:bg-white/[0.03] transition rounded-b-2xl">
          Show more
        </button>
      </div>
    </div>
  );
} 