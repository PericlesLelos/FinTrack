interface ToDoCardProps {
    id: number
    name: string
    description: string
    dueDate: Date
    priority: number
    completed: boolean
    onEdit: () => void
    onDelete: () => void
}

export default function ToDoCard(props: ToDoCardProps) {
    const now = Date.now()
    const isOverdue = !props.completed && props.dueDate.getTime() < now

    const wrapperClass = props.completed
        ? 'flex flex-row m-2 p-2 rounded-md border-1 border-green-300 bg-green-50 hover:bg-green-100'
        : isOverdue
            ? 'flex flex-row m-2 p-2 rounded-md border-1 border-red-300 bg-red-50 hover:bg-red-100'
            : 'flex flex-row m-2 p-2 rounded-md border-1 border-black hover:bg-gray-100'

    const titleClass = props.completed ? 'font-semibold text-lg text-green-800' : isOverdue ? 'font-semibold text-lg text-red-800' : 'font-semibold text-lg text-black'
    const descClass = props.completed ? 'text-sm text-green-700' : isOverdue ? 'text-sm text-red-700' : 'text-sm text-black'

    return (
        <div className={wrapperClass}>
            <div className="flex-1">
                <h3 className={titleClass}>{props.name}</h3>
                <p className={descClass}>{props.description}</p>
                <div className="mt-2 text-xs flex gap-4">
                    <span className={isOverdue ? 'text-red-800' : 'text-gray-700'}>Due: {props.dueDate.toLocaleDateString()}</span>
                    <span className="text-gray-700">Priority: {props.priority}</span>
                    <span className={props.completed ? 'text-green-800' : isOverdue ? 'text-red-800' : 'text-gray-700'}>Status: {props.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}</span>
                </div>
            </div>
             {/* Edit/Delete buttons live inside the card now */}
            <div className="ml-4 flex flex-col gap-2">
                <button
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={props.onEdit}
                >
                    Edit
                </button>
                <button
                    className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    onClick={props.onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    )
} 
    
