export default function SubjectList(props) {
    return (
        <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold text-indigo-400 mb-8 mx-auto w-max">
                Expertise
            </h2>
            <ul>
                {props.subjects.map((subject, index) => (
                    <li className="mb-2 text-lg text-indigo-500 bg-indigo-950 rounded-xl p-5" key={index}>
                        🔵 <span className="ml-2">{subject}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
