export const getUnmetPasswordRequirements = (password) => {
    const requirements = [];
    if (!/\d/.test(password)) {
      requirements.push('at least one number');
    }
    if (!/[A-Z]/.test(password)) {
      requirements.push('at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      requirements.push('at least one lowercase letter');
    }
    if (!/[$;._\-*]/.test(password)) {
      requirements.push('at least one of the following symbols: $ ; . _ - *');
    }
    if (!/^.{8,}$/.test(password)) {
      requirements.push('at least 8 characters');
    }
    return requirements;
  };  