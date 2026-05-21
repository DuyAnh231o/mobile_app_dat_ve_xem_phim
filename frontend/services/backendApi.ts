const BASE_URL = "http://192.168.62.104:3000";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Server trả về không phải JSON: ${text}`);
  }

  if (!res.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || `HTTP ${res.status}`
    );
  }

  return data;
}

export function login(email: string, password: string) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMovies() {
  return request("/movies");
}

export function getMovieById(id: string | number) {
  return request(`/movies/${id}`);
}

export function getShowtimes() {
  return request("/showtimes");
}

export function getShowtimesByMovie(movieId: string | number) {
  return request("/showtimes").then((all: any[]) =>
    all.filter((s) => s.movie_id === String(movieId))
  );
}

export function getTheaters() {
  return request("/theaters");
}

export function getSeatsByShowtime(showtimeId: string | number) {
  return request(`/seats/showtime/${showtimeId}`);
}

export function createBooking(
  token: string,
  body: {
    showtime_id: number;
    seat_ids: number[];
  },
) {
  return request("/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export function createPayment(
  token: string,
  body: {
    booking_id: number;
    method: "CASH" | "MOMO" | "VNPAY" | "BANKING";
  },
) {
  return request("/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}