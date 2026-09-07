export default function Skeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-indigo-100 rounded-full" />
          <div className="h-11 w-full bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}