import Swal  from 'sweetalert2';

export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function validatePassword(password) {
    return (password.length >= 8)
}

export const getStrength = ({ password = "" }) => {
    if (password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password)) {
        return "Strong";
    }

    if (password.length >= 6) {
        return "Medium";
    }

    return "Weak";
};
export const validateOtp = (otp) => {

    if (!otp) {
        return "OTP is required";
    }

    if (otp.length !== 6) {
        return "OTP must be 6 digits";
    }

    if (!/^\d{6}$/.test(otp)) {
        return "OTP must contain only numbers";
    }

    return "";
}

export const showDeleteConfirm = async (title,text,icon) => {

    const result = await Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Delete"
    });

    return result.isConfirmed;
};