/**
 * แปลง ISO Date String ให้เป็นรูปแบบ "Day Month Year"
 * @param {string} dateString - ตัวอย่าง "2024-08-21T00:00:00.000Z"
 * @returns {string} - ผลลัพธ์ "21 August 2024"
 */
export const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const options = { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    };
    
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
  };