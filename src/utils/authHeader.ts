export const authHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
