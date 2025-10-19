interface FormHeaderI {
    headerText: string
}

const FormHeader = ({headerText}: FormHeaderI) => {
    return (
        <div className="text-2xl font-semibold">{headerText}</div>
    )
}

export default FormHeader