import { Users } from 'lucide-react';

interface Collaborator {
  userId: string;
  userName: string;
  color: string;
  online_at: string;
}

interface CollaboratorListProps {
  collaborators: Collaborator[];
  currentUserName: string;
}

export default function CollaboratorList({ collaborators, currentUserName }: CollaboratorListProps) {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-slate-200 p-3 min-w-[200px] z-10">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
        <Users className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-semibold text-slate-900">
          {collaborators.length + 1} Active
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-700 font-medium">
            {currentUserName} (You)
          </span>
        </div>

        {collaborators.map((collaborator) => (
          <div key={collaborator.userId} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: collaborator.color }}
            ></div>
            <span className="text-sm text-slate-700">{collaborator.userName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
