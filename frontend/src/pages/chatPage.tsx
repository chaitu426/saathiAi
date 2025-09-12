import { useParams } from "react-router-dom";
import  {ChatInterface}  from "../components/chat/ChatInterface";
import { AppLayout } from "../components/layout/AppLayout";

export default function ChatPage() {
  const { frameId } = useParams<{ frameId: string }>();

  return (
    <AppLayout>
      <ChatInterface frameId={frameId} />
    </AppLayout>
  );
}