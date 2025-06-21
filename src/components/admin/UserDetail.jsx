import { useContext } from "react";
import myContext from "../../context/myContext";

const UserDetail = () => {
    const context = useContext(myContext);
    const { getAllUser } = context;

    return (
        <div className="w-full overflow-x-auto">
            <div className="py-5 flex justify-between items-center">
                <h1 className="text-xl text-purple-300 font-bold">All User</h1>
            </div>

            <div className="w-full overflow-x-auto mb-24 sm:mb-10">
                <table className="w-full min-w-[800px] text-left border border-collapse sm:border-separate border-purple-100 text-purple-400">
                    <thead>
                        <tr className="bg-purple-50 text-slate-800 font-bold text-[15px]">
                            {["S.No.", "Name", "Email", "Uid", "Role", "Date"].map((heading, i) => (
                                <th
                                    key={i}
                                    className="h-12 px-6 text-sm sm:text-md border-l first:border-l-0 border-purple-100 text-slate-700 bg-slate-100 font-bold text-center"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getAllUser.map((value, index) => (
                            <tr key={index} className="text-purple-300">
                                <td className="h-12 px-6 border-t border-l first:border-l-0 border-purple-100 text-slate-500">
                                    {index + 1}
                                </td>
                                <td className="h-12 px-6 border-t border-l first:border-l-0 border-purple-100 text-slate-500 whitespace-nowrap truncate max-w-[150px]">
                                    {value.name}
                                </td>
                                <td className="h-12 px-6 border-t border-l first:border-l-0 border-purple-100 text-slate-500 whitespace-nowrap truncate max-w-[200px]">
                                    {value.email}
                                </td>
                                <td className="h-12 px-6 border-t border-l first:border-l-0 border-purple-100 text-slate-500 truncate max-w-[200px]">
                                    {value.uid}
                                </td>
                                <td
                                    className={`h-12 px-6 border-t border-l first:border-l-0 border-purple-100 font-semibold uppercase ${value.role === "user" ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {value.role}
                                </td>

                                <td className="h-12 px-6 border-t border-l first:border-l-0 border-purple-100 text-slate-500">
                                    {value.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default UserDetail;
