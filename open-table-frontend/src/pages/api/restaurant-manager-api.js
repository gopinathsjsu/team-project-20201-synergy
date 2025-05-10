const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export const uploadImageToS3 = async (file, folder) => {
  // Generate a unique filename;
  const fileName = `${Date.now()}-${file.name}`;

  // Request a pre-signed URL from the backend.
  // NOTE: Ensure that your API URL and query parameters match your backend.
  const presignedRes = await fetch(
    `${API_BASE}/api/manager/presigned-url?folder=${folder}&fileName=${encodeURIComponent(
      fileName
    )}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!presignedRes.ok) {
    const errorData = await presignedRes.json();
    const errMsg = errorData.errorMessage || "Failed to get pre-signed URL";
    throw new Error(errMsg);
  }

  const result = await presignedRes.json();
  const presignedUrl = result.data; // String URL

  // Now, upload the file directly to S3 via HTTP PUT.
  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Image upload to S3 failed");
  }

  const key = `${folder}/${fileName}`;

  console.log("upload image to S3 response:", presignedUrl);
  return { key };
};

export const addRestaurant = async (payload) => {
  console.log("payload for add restaurant:", payload);

  const response = await fetch(
    `${API_BASE}/api/manager/restaurants`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errMsg = errorData.errorMessage || "Failed to register restaurant";
    throw new Error(errMsg);
  }

  const result = await response.json();
  console.log("add restaurant API response:", result);
  return result.data;
};

export const updateRestaurant = async (id, payload) => {
  console.log("payload for upload restaurant:", payload);

  const response = await fetch(
    `${API_BASE}/api/manager/restaurants/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errMsg = errorData.errorMessage || "Failed to update restaurant";
    throw new Error(errMsg);
  }

  const result = await response.json();
  console.log("update restaurant API response:", result);
  return result.data;
};

/**
 * Deletes multiple files from S3 by calling the backend bulk deletion API.
 * @param {string[]} keys - Array of S3 object keys to be deleted.
 * @returns {Promise<boolean>} - Resolves to true if deletion is successful.
 * @throws {Error} - Throws an error if deletion fails.
 */
export const deleteFilesBulk = async (keys) => {
  const response = await fetch(`${API_BASE}/api/manager/bulk`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(keys),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errMsg = errorData.errorMessage || "Bulk deletion failed";
    throw new Error(errMsg);
  }

  return true;
};

export const fetchRestaurants = async () => {
  const response = await fetch(`${API_BASE}/api/manager/restaurants`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errMsg = errorData.errorMessage || "Failed to fetch restaurants";
    throw new Error(errMsg);
  }

  const result = await response.json();
  return result.data;
};

export const getBatchPresignedUrls = async (keys) => {
  const response = await fetch(`${API_BASE}/api/s3/presigned-url/batch`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(keys),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errMsg = errorData.errorMessage || "Failed to fetch presigned URLs";
    throw new Error(errMsg);
  }

  const result = await response.json();
  // Returns an object mapping S3 key to its presigned URL.
  return result.data;
};

// fetch restaurant details by id
export const fetchRestaurantDetailsById = async (id) => {
  const response = await fetch(`${API_BASE}/api/manager/restaurants/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errMsg = errorData.errorMessage || "Failed to fetch restaurant details";
    throw new Error(errMsg);
  }

  const result = await response.json();
  return result.data;
};
