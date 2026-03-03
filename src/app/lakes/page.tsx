import LakeGrid from "@/components/LakeGrid";

export default function LakesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Lakes</h1>
      <p className="text-sm text-gray-500 mb-6">
        Pick a lake to view posts and chat.
      </p>
      <LakeGrid />
    </div>
  );
}
