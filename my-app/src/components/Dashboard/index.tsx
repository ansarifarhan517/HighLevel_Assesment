import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

interface DashboardProps {
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

// Dummy API call
const fetchContactsFromApi = async (): Promise<Contact[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Alice Wonderland', phoneNumber: '123-456-7890' },
        { id: '2', name: 'Bob The Builder', phoneNumber: '987-654-3210' },
        { id: '3', name: 'Charlie Brown', phoneNumber: '555-555-5555' },
      ]);
    }, 500); // Simulate network delay
  });
};

const Dashboard: React.FC<DashboardProps> = ({ setIsUserLoggedIn }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactNumber, setNewContactNumber] = useState<string>('');
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{ name: string; phoneNumber: string }>({ name: '', phoneNumber: '' });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        const fetchedContacts = await fetchContactsFromApi();
        setContacts(fetchedContacts);
        setError(null);
      } catch (err) {
        setError('Failed to load contacts.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadContacts();
  }, []);

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    // You might also want to clear any stored tokens or user session data here
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactNumber.trim()) {
      alert('Name and phone number cannot be empty.');
      return;
    }
    const newContact: Contact = {
      id: Date.now().toString(), // Simple unique ID for demo purposes
      name: newContactName,
      phoneNumber: newContactNumber,
    };
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactNumber('');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleStartEdit = (contact: Contact) => {
    setEditingContactId(contact.id);
    setEditFormData({ name: contact.name, phoneNumber: contact.phoneNumber });
  };

  const handleCancelEdit = () => {
    setEditingContactId(null);
    setEditFormData({ name: '', phoneNumber: '' });
  };

  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateContact = () => {
    if (!editingContactId || !editFormData.name.trim() || !editFormData.phoneNumber.trim()) {
      alert('Name and phone number cannot be empty for update.');
      return;
    }
    setContacts(
      contacts.map(contact =>
        contact.id === editingContactId ? { ...contact, ...editFormData } : contact
      )
    );
    handleCancelEdit(); // Reset editing state
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateContact();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (isLoading) return <div style={styles.container}>Loading contacts...</div>;
  if (error) return <div style={styles.container}>{error} <button onClick={handleLogout}>Logout</button></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Contacts Dashboard</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.addContactForm}>
        <h3>Add New Contact</h3>
        <input type="text" placeholder="Name" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} style={styles.input} />
        <input type="text" placeholder="Phone Number" value={newContactNumber} onChange={(e) => setNewContactNumber(e.target.value)} style={styles.input} />
        <button onClick={handleAddContact} style={styles.button}>Add Contact</button>
      </div>

      <h3>Contact List</h3>
      {contacts.length === 0 && !isLoading ? <p>No contacts yet. Add one above!</p> : (
        <ul style={styles.list}>
          {contacts.map((contact) => (
            <li key={contact.id} style={styles.listItem}>
              {editingContactId === contact.id ? (
                <>
                  <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} onKeyDown={handleEditKeyDown} style={styles.input} autoFocus />
                  <input type="text" name="phoneNumber" value={editFormData.phoneNumber} onChange={handleEditFormChange} onKeyDown={handleEditKeyDown} style={styles.input} />
                  <button onClick={handleUpdateContact} style={{...styles.iconButton, ...styles.saveButton}}>Save</button>
                  <button onClick={handleCancelEdit} style={{...styles.iconButton, ...styles.cancelButton}}>Cancel</button>
                </>
              ) : (
                <>
                  <span style={styles.contactInfo}>{contact.name} - {contact.phoneNumber}</span>
                  <div style={styles.actions}>
                    <button onClick={() => handleStartEdit(contact)} style={styles.iconButton} title="Edit">✏️</button>
                    <button onClick={() => handleDeleteContact(contact.id)} style={styles.iconButton} title="Delete">🗑️</button>
                    {/* If a third icon is needed, its functionality can be added here */}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Basic styles - consider moving to a CSS file for larger applications
const styles: { [key: string]: React.CSSProperties } = {
  container: { fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  logoutButton: { padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  addContactForm: { marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' },
  input: { padding: '8px', margin: '5px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '5px' },
  list: { listStyleType: 'none', padding: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' },
  contactInfo: { flexGrow: 1 },
  actions: { display: 'flex', alignItems: 'center' },
  iconButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em', padding: '5px', margin: '0 5px' },
  saveButton: { color: 'green' },
  cancelButton: { color: 'gray' },
};

export default Dashboard;