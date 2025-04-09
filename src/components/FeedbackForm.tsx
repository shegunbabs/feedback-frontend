import {ChevronDownIcon} from "@heroicons/react/16/solid";
import {useState} from "react";
import FormError from "./FormError.tsx";
import Emojis from "./Emojis.tsx";
import AlertSuccess from "./AlertSuccess.tsx";
import Loading from "./Loading.tsx";
import {feedbackUrl} from "./urls.tsx";

function FeedbackForm({close, refreshData}: { close: () => void, refreshData: () => Promise<void> }) {

    interface FormErrors {
        errors?: {
            customer_name?: string,
            message?: string,
            rating?: string,
        };
    }

    const [formData, setFormData] = useState({
        customer_name: '',
        message: '',
        rating: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [submitResponse, setSubmitResponse] = useState({
        success: false,
        message: ''
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({...prevState, [name]: value}));
    }

    const resetFormData = () => {
        setFormData({
            customer_name: '',
            message: '',
            rating: '',
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(feedbackUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.status === 422) {
                const result = await response.json();
                setFormErrors(result);
            }

            if (!response.ok) {
                throw new Error(`Error occurred while submitting feedback`);
            }

            const result = await response.json();
            setFormErrors({})
            setSubmitResponse({
                success: true,
                message: result.message,
            })
            resetFormData();
            await refreshData();
            setTimeout(() => close(), 2000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitResponse({
                    success: false,
                    message: err.message,
                })
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>

            {submitResponse?.success && submitResponse?.message && <AlertSuccess message={submitResponse.message}/>}

            <form onSubmit={handleSubmit} className="space-y-4 relative">

                {isSubmitting && <Loading/>}

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 px-6">

                    <div className="sm:col-span-3">

                        <label htmlFor="customer_name" className="block text-sm/6 font-medium text-gray-900">
                            Customer Name
                        </label>

                        <div className="mt-2">
                            <input id="customer_name" type="text" name="customer_name" value={formData.customer_name}
                                   onChange={handleChange} required
                                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-slate-600 sm:text-sm/6"/>
                            {
                                formErrors && formErrors?.errors?.customer_name &&
                                <FormError message={formErrors.errors.customer_name}/>
                            }
                        </div>

                    </div>

                    <div className="sm:col-span-3">

                        <label htmlFor="message" className="block text-sm/6 font-medium text-gray-900">
                            Add your message
                        </label>

                        <div className="mt-2">
                            <textarea id="message" rows={4} name="message" value={formData.message}
                                      onChange={handleChange} required
                                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-slate-600 sm:text-sm/6"
                            />
                            {
                                formErrors && formErrors?.errors?.message &&
                                <FormError message={formErrors.errors.message}/>
                            }
                        </div>

                    </div>

                    <div className="sm:col-span-3">

                        <label htmlFor="rating" className="block text-sm/6 font-medium text-gray-900">
                            Rating
                        </label>

                        <div className="mt-2 grid grid-cols-1">
                            <select id="rating" name="rating" value={formData.rating} onChange={handleChange} required
                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <ChevronDownIcon aria-hidden="true"
                                             className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"/>
                            {
                                formErrors && formErrors?.errors?.rating &&
                                <FormError message={formErrors.errors.rating}/>
                            }
                        </div>

                    </div>

                    <div className="sm:col-span-3">
                        <div className="text-sm">How happy are you with this app</div>
                        <Emojis/>
                    </div>

                </div>

                <div className="mt-7 pt-3 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button type="submit" disabled={isSubmitting}
                            className="inline-flex w-full justify-center rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 sm:ml-3 sm:w-auto">
                        Submit
                    </button>

                    <button type="button" data-autofocus
                            onClick={close}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )

}

export default FeedbackForm;