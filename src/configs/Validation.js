const toArray = (str) => {
    if (Array.isArray(str)) {
        return str.map(text => text.trim()).filter(Boolean);
    }
    if (typeof str === 'string') {
        return str.split(',').map(strs => strs.trim()).filter(Boolean);
    }
    return [];
};

export const tempValidatePreferences = (form) => {
    const errors = {};

    if (!form.profileSummary?.trim()) {
        errors.profileSummary = "Profile Summary is required";
    }
    if (toArray(form.skills).length === 0) {
        errors.skills = "At least one skill is required";
    }

    if (!form.experience) {
        errors.experience = "Experience is required";
    }

    switch (true) {
        case !form.currentSalary:
            errors.currentSalary = 'Please enter your current salary.';
            break;
        case isNaN(form.currentSalary):
        case Number(form.currentSalary) <= 0:
            errors.currentSalary = 'Current salary must be a valid positive number.';
            break;
    }

    switch (true) {
        case !form.expectedSalary:
            errors.expectedSalary = 'Please enter your expected salary.';
            break;
        case isNaN(form.expectedSalary):
        case Number(form.expectedSalary) <= 0:
            errors.expectedSalary = 'Expected salary must be a valid positive number.';
            break;
        case Number(form.expectedSalary) <= Number(form.currentSalary):
            errors.expectedSalary = 'Expected salary should be higher than current salary.';
            break;
    }

    if (toArray(form.qualifications).length === 0) {
        errors.qualifications = "At least one qualification is required";
    }

    if (toArray(form.roles).length === 0) {
        errors.roles = "At least one role requred";
    }

    return errors;
};

export const temValidateLogin = (form = {}) => {
    const errors = {};

    if (!form.username || form.username.trim() === '') {
        errors.username = 'Username is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        const isEmail = emailRegex.test(form.username);
        const isPhone = phoneRegex.test(form.username);

        if (!isEmail && !isPhone) {
            errors.username = 'Enter a valid email or 10-digit phone number';
        }
    }

    if (!form.password || form.password.trim() === '') {
        errors.password = 'Password is required';
    } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
};


export const tempValidateSingUp = (values) => {
    console.log("values", values)
    const errors = {};

    if (!values.firstName.trim()) {
        errors.firstName = 'First name is required';
    }
    if (!values.lastName.trim()) {
        errors.lastName = 'Last name is required';
    }
    if (!values.phone.trim()) {
        errors.phone = 'Phone number is required';
    }
    else if (!/^\d{10}$/.test(values.phone)) {
        errors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!values.email.trim()) {
        errors.email = 'Email is required';
    }
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Enter a valid email address';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    }
    else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }


    return errors;
};

export const validatePostJob = (form) => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Job Title is required';
    if (!form.companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.skills.trim()) newErrors.skills = 'At least one skill is required';
    if (!form.proficiencyLevel) newErrors.proficiencyLevel = 'Select a proficiency level';
    if (!form.locations.trim()) newErrors.locations = 'Locations are required';
    if (!form.location) newErrors.location = 'Select a location';
    if (!form.openings || form.openings <= 0) newErrors.openings = 'Openings must be at least 1';

    if (toArray(form.additionalSkills).length === 0) {
        newErrors.additionalSkills = "At least one additional skills is required";
    }

    if (!form.minSalary) {
        newErrors.minSalary = 'Min salary must be a valid number';
    }

    if (!form.maxSalary) {
        newErrors.maxSalary = 'Max salary must be a valid number';
    }

    return newErrors;
};


