interface CursorPosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
}

interface CollaboratorCursorsProps {
  cursors: CursorPosition[];
}

export default function CollaboratorCursors({ cursors }: CollaboratorCursorsProps) {
  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute pointer-events-none z-50 transition-transform duration-75"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-2px, -2px)',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.65376 12.3673L10.6477 17.3612L18.5 5.5L5.65376 12.3673Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          <div
            className="mt-1 px-2 py-1 rounded text-xs font-medium text-white shadow-lg whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </div>
      ))}
    </>
  );
}
