import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for generating unique IDs

const ExpenseCard = () => {
    const [expense, setExpense] = useState('');
    const [price, setPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editedExpense, setEditedExpense] = useState('');
    const [editedPrice, setEditedPrice] = useState('');
    const [editedQuantity, setEditedQuantity] = useState(0); // State for edited quantity

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(storedExpenses);
        const totalPriceLocal = parseFloat(localStorage.getItem('totalPrice')) || 0;
        setTotalPrice(totalPriceLocal);
    }, []);

    const addItem = (e) => {
        e.preventDefault();

        if (expense === '' || price === '' || quantity === '') {
            alert('Please fill in all values');
        } else {
            const newItemPrice = parseFloat(price) * parseInt(quantity);
            const newExpense = { id: uuidv4(), name: expense, price: parseFloat(price), quantity: parseInt(quantity) };
            const updatedExpenses = [...expenses, newExpense];
            setExpenses(updatedExpenses);
            localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            setExpense('');
            setPrice('');
            setQuantity(0);

            const newTotal = parseFloat(totalPrice) + newItemPrice;
            setTotalPrice(newTotal);
            localStorage.setItem('totalPrice', newTotal);
        }
    };


    const deleteItem = (id) => {
        const deletedItem = expenses.find(expense => expense.id === id);
        const newTotal = parseFloat(totalPrice) - (parseFloat(deletedItem.price) * parseInt(deletedItem.quantity)); // Adjust total based on deleted item's price and quantity
        const updatedExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(updatedExpenses);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        setTotalPrice(newTotal);
        localStorage.setItem('totalPrice', newTotal);
    };

    const editItem = (id) => {
        setEditingId(id);
        const expenseToEdit = expenses.find(expense => expense.id === id);
        setEditedExpense(expenseToEdit.name);
        setEditedPrice(expenseToEdit.price);
        setEditedQuantity(expenseToEdit.quantity); // Set the edited quantity
    };

    const saveEditedItem = () => {
        const updatedExpenses = expenses.map(expense => {
            if (expense.id === editingId) {
                return { ...expense, name: editedExpense, price: parseInt(editedPrice), quantity: parseInt(editedQuantity) }; // Update quantity too
            }
            return expense;
        });
        setExpenses(updatedExpenses);

        // Find the original price and quantity of the edited item
        const originalItem = expenses.find(expense => expense.id === editingId);
        const originalPrice = originalItem.price * originalItem.quantity;

        // Calculate the difference between the original and edited prices
        const priceDifference = (parseInt(editedPrice) * parseInt(editedQuantity)) - originalPrice;

        // Update the total price by adding the price difference
        const newTotal = totalPrice + priceDifference;
        setTotalPrice(newTotal);
        localStorage.setItem('totalPrice', newTotal);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        setEditingId(null);
    };


    const clearItems = () => {
        setExpenses([]);
        localStorage.removeItem('expenses');
        localStorage.removeItem('totalPrice');
    };

    return (
        <Card style={{ width: '100%', margin: 'auto', padding: '20px', backgroundColor: '#f8f9fa' }}>
            <Card.Body>
                <Card.Title style={{ fontSize: '35px', textAlign: 'center', marginBottom: '30px' }}><b>Expense Tracker</b></Card.Title>
                <Form className='mb-5'>
                    <Form.Group controlId="formExpense">
                        <Form.Label><b>Item Name:</b></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter expense"
                            value={expense}
                            onChange={(e) => setExpense(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice" className="mt-3">
                        <Form.Label><b>Item Amount:</b></Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice" className="mt-3">
                        <Form.Label><b>Item Quantity:</b></Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="success" onClick={addItem} type="button" className="mb-2 mb-sm-0 mt-3" style={{ width: '100%', maxWidth: '150px' }}>
                        Add
                    </Button>
                    <Button variant="danger" onClick={clearItems} type="button" className="mx-sm-2 mt-3" style={{ width: '100%', maxWidth: '150px' }}>
                        Clear All
                    </Button>

                </Form>
                <h5 className='text-center' style={{ marginBottom: '20px' }}><strong>Total Price: ${totalPrice.toFixed(2)}</strong></h5>
                {expenses.length > 0 && (
                    expenses.map((expense) => (
                        <div key={expense.id} style={{ marginBottom: '20px', display: 'flex', background: '#fff', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #ced4da', borderRadius: '5px', padding: '10px' }}>
                            {editingId === expense.id ? (
                                <div style={{ width: '70%' }}>
                                    <Form.Group controlId="formExpense" className="mb-3">
                                        <Form.Label><b>Item Name:</b></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedExpense}
                                            onChange={(e) => setEditedExpense(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPrice" className="mb-3">
                                        <Form.Label><b>Item Amount:</b></Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editedPrice}
                                            onChange={(e) => setEditedPrice(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formQuantity" className="mb-3">
                                        <Form.Label><b>Item Quantity:</b></Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editedQuantity}
                                            onChange={(e) => setEditedQuantity(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={() => saveEditedItem()} variant="success" style={{ marginRight: '10px' }}>Update</Button>
                                        <Button onClick={() => setEditingId(null)} variant="secondary">Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ width: '70%' }}>
                                    <div>
                                        <strong>{expense.name} ({expense.quantity}):</strong> <strong>${expense.price}</strong>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => editItem(expense.id)} variant="primary" className="ml-3">Edit</Button>
                                <Button onClick={() => deleteItem(expense.id)} variant="danger" className="mx-2 ml-3">Delete</Button>
                            </div>
                        </div>
                    ))
                )}

            </Card.Body>
        </Card>
    );
};

export default ExpenseCard;
