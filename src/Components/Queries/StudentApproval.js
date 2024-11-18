import { useContext, useState, useEffect } from "react";
import UserContext from "../../Hooks/UserContext";
import { Navigate } from "react-router-dom";
import axios from "../../config/api/axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { TableHeader } from "../Table";
import ErrorStrip from "../ErrorStrip";

const StudentApproval = () => {
  const { user } = useContext(UserContext);
  const [newStudents, setNewStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getNewStudents = async () => {
      try {
        console.log("Fetching students for HOD department:", user.department);
        const response = await axios.get(`student/approve/${user.department}`);
        console.log("API Response:", response);
        setNewStudents(response.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        if (err.response?.status === 404) {
          // Handle no students case
          setNewStudents([]);
        }
        setError(err);
      }
    };
    getNewStudents();
  }, [user]);

  const handleApprove = async (e) => {
    const index = e.currentTarget.id;
    const student = newStudents[index];
    
    try {
      const response = await axios.patch("/student/" + student._id, {
        id: student._id,
        approved: true
      });
      
      // Remove from list after approval
      const updatedStudents = [...newStudents];
      updatedStudents.splice(index, 1);
      setNewStudents(updatedStudents);
      
      toast.success("Student approved successfully");
    } catch (err) {
      console.error("Approval error:", err);
      setError(err);
    }
  };

  const handleDelete = async (e) => {
    const student = newStudents[e.currentTarget.id]._id;
    try {
      const response = await axios.delete("/student/" + student);
      newStudents.splice(e.currentTarget.id, 1);
      toast.success(response.data.message);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      {user.role === "HOD" ? (
        <main>
          <h2 className="text-4xl font-bold mb-4">Approve Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader Headers={["Name", "Email", "Course", "Approve", "Reject"]} />
              <tbody>
                {newStudents?.map((student, index) => (
                  <tr key={index}>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.email}</td>
                    <td className="p-2">{student.course}</td>
                    <td>
                      <button onClick={(e) => handleApprove(e)} id={index}>
                        <FaPlus />
                      </button>
                    </td>
                    <td>
                      <button onClick={(e) => handleDelete(e)} id={index}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <ErrorStrip error={error} />}
        </main>
      ) : (
        <Navigate to="/dash" />
      )}
    </>
  );
};

export default StudentApproval; 