export default function ChatButton({ onOpen }:{onOpen:()=>void}) {
  return (
    <button onClick={onOpen} className="fixed px-4 py-2 text-white bg-black rounded-full shadow bottom-4 right-4">
      Live Chat
    </button>
  );
}