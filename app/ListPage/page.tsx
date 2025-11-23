import ToDoCard from "@/Components/ToDoCard";
import sampleTodos from "@/data/sampleTodos";
import NavBar from "@/Components/NavBar";
import TaskSummary from "@/Components/TaskSummary";
export default function ListPage() {
    return (      
        <div>
            <NavBar />
            <TaskSummary />
            <div className="bg-white text-black min-h-screen p-4">
                <div className="grid grid-cols-1 gap-4">
                    {[...sampleTodos].sort((a,b) => b.priority - a.priority)
                    .map((item) => (
                        <ToDoCard key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
}