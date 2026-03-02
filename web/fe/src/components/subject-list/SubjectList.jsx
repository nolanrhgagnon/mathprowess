export default function SubjectList(props) {
    return (
        <div className="flex-1 p-4">
            <h2 className="text-3xl font-bold text-gray-300 mb-4 mx-auto w-max">
                Expertise
            </h2>
            <ul>
                {props.subjects.map((subject, index) => (
                    <li className="mb-2 text-lg text-gray-300 bg-zinc-900 rounded p-5" key={index}>
                        🔵 <span className="ml-2">{subject}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
