import {useState, useEffect, useCallback} from "react";
import getFeedbacks from "./getFeedbacks.tsx";
import Star from "./icons/Star.tsx";
import Modal from "./Modal.tsx";
import {ChevronDownIcon} from "@heroicons/react/16/solid";
import Loading from "./Loading";
import {feedbackUrl} from "./urls.tsx";

function Feedback() {

    const [feedback, setFeedback] = useState({
        data: [{
            customer_name: "",
            message: "",
            rating: 1,
        }]
    })
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)

    const fetchFeedbacks = useCallback( async (url = '') => {

        setLoading(true);
        try {
            const realUrl = url ? url : feedbackUrl;
            const feedbackData = await getFeedbacks(realUrl);
            setFeedback(feedbackData);
            setError('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setFeedback({data:[]});
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {

        fetchFeedbacks();
    }, [fetchFeedbacks])


    return (

        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button onClick={() => setOpen(true)} type="button"
                                className="block rounded-md bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 cursor-pointer">
                            Add User Feedback
                        </button>
                    </div>
                </div>

                { error && <div>Unknown Error occurred</div>}

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 relative">
                                    {loading && <Loading/>}
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Customer
                                            name
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Message
                                        </th>
                                        <th scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating

                                            <div className="ml-4 inline-flex">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <label htmlFor="rating"
                                                           className="block text-xs/6 font-medium text-gray-900">
                                                        Sort
                                                    </label>
                                                    <div className="grid grid-cols-1">
                                                        <select
                                                            id="rating" name="rating" defaultValue="None"
                                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-xs text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-xs/6"
                                                            onChange={(e) => { fetchFeedbacks(`${feedbackUrl}${e.target.value ? '?rating=' + e.target.value : ''}`)}}>
                                                                <option value="">None</option>
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                            </select>
                                                        <ChevronDownIcon aria-hidden="true"
                                                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"/>
                                                    </div>

                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {feedback?.data?.map((item) => (
                                        <tr key={item.customer_name}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-left">
                                                {item.customer_name}
                                            </td>
                                            <td className="whitespace-wrap px-3 py-4 text-sm text-gray-500 text-left max-w-xl">
                                                { item.message }
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-left">
                                                <Star />
                                                {
                                                    item.rating && Array.from({length: item.rating - 1}, (_,index) => (
                                                        <Star key={index} />
                                                    ))
                                                }
                                            </td>
                                        </tr>
                                    ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={open} close={close} refreshData={fetchFeedbacks} />
        </>
    )

}

export default Feedback;