import LoadingUi from "@/components/ui/loading-ui";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingUi className="min-h-0" />
    </div>
  );
}
