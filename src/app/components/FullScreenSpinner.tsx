export default function SpinnerFullScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div
                className="animate-spin inline-block w-20 h-20 border-[3px] border-current border-t-transparent text-stone-600 rounded-full"
                role="status"
                aria-label="loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
