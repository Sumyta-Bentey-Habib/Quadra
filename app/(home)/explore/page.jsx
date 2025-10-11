import ExploreFeed from "./ExploreFeed";

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-background text-gray-800 dark:text-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Explore</h1>
        <ExploreFeed />
      </div>
    </div>
  );
};

export default ExplorePage;
