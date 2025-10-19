interface FormDescriptionI {
    description: string
}

const FormDescription = ({description}: FormDescriptionI) => {
    return (
        <div className="text-sm text-muted-foreground">{description}</div>
    )
}

export default FormDescription