type TaskSummaryProps = {
    summary: {
        total: number
        completed: number
        pending: number
        overdue: number
        highPriority: number
        nextDue: Date | null
    }
}

export default function TaskSummary({ summary }: TaskSummaryProps) {
    return (
        <div className="p-4 bg-white border-b mb-4">
            <h2 className="text-xl font-semibold mb-2">Task Summary</h2>
            <div className="flex gap-4 flex-wrap">
                <div className="p-2 border rounded">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-lg font-bold">{summary.total}</div>
                </div>
                <div className="p-2 border rounded">
                    <div className="text-sm text-gray-500">Completed</div>
                    <div className="text-lg font-bold">{summary.completed}</div>
                </div>
                <div className="p-2 border rounded">
                    <div className="text-sm text-gray-500">Pending</div>
                    <div className="text-lg font-bold">{summary.pending}</div>
                </div>
                <div className="p-2 border rounded">
                    <div className="text-sm text-gray-500">Overdue</div>
                    <div className="text-lg font-bold text-red-600">{summary.overdue}</div>
                </div>
                <div className="p-2 border rounded">
                    <div className="text-sm text-gray-500">High Priority</div>
                    <div className="text-lg font-bold">{summary.highPriority}</div>
                </div>
                <div className="p-2 border rounded">
                    <div className="text-sm text-gray-500">Next Due</div>
                    <div className="text-lg font-bold">{summary.nextDue ? summary.nextDue.toLocaleString() : '—'}</div>
                </div>
            </div>
        </div>
    )
}