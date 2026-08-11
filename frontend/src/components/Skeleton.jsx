export default function Skeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-md" />
        </div>
      ))}
    </div>
  );
}