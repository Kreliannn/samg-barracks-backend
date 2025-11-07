import Activities from "../model/activities.model"
import { activityInterface } from "../types/activities.type"

export const createActivity = async (employee : string, branch : string, role : "admin" | "manager" | "cashier", action : string) => {
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const date = now.toISOString().split("T")[0];

    const newActivity = {
        employee,
        action,
        role,
        branch,
        time,
        date
    }

    await Activities.create(newActivity)
}

export const getActivity = async (branch: string) => {
  const activities = await Activities.find({ branch })
    .sort({ _id: -1 }) 
    .limit(30);        
  return activities;
};


