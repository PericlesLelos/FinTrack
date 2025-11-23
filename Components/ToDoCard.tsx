interface ToDoCardProps {
    id: number
    name: string
    description: string
    dueDate: Date
    priority: number
    completed: boolean

}

export default function ToDoCard(props: ToDoCardProps) {
    return (
        <div className="flex flex-row text-black m-2 p-2 border-1 rounded-md border-black hover:bg-gray-100">
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-black">{props.name}</h3>
                <p className="text-sm text-black">{props.description}</p>
                <div className="mt-2 text-xs flex gap-4 text-black">
                    <span>Due: {props.dueDate.toLocaleDateString()}</span>
                    <span>Priority: {props.priority}</span>
                    <span>Status: {props.completed ? 'Completed' : 'Pending'}</span>
                </div>
            </div>
        </div>
    )
} 
    
