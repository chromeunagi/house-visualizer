import React, { useState, useEffect } from 'react';

const HousePresenceVisualizer = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const personStyles = [
        // Diagonal line box
        (ctx, size) => {
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, size, size);
            ctx.beginPath();
            ctx.moveTo(0, size);
            ctx.lineTo(size, 0);
            ctx.stroke();
        },
        // Box with dots inside
        (ctx, size) => {
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, size, size);
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(size * 0.3, size * 0.3, 2, 0, 2 * Math.PI);
            ctx.arc(size * 0.7, size * 0.7, 2, 0, 2 * Math.PI);
            ctx.fill();
        },
        // Box half filled with greyscale
        (ctx, size) => {
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, size, size);
            ctx.fillStyle = '#bbb';
            ctx.fillRect(0, 0, size, size / 2);
        }
    ];

    const [people, setPeople] = useState([
        { id: 1, name: 'Alice', room: 'living-room', x: 62, y: 17, style: 0 },
        { id: 2, name: 'Bob', room: 'kitchen', x: 42, y: 30, style: 1 },
        { id: 3, name: 'Charlie', room: 'bedroom', x: 17, y: 35, style: 2 }
    ]);

    const rooms = {
        'garage': { name: 'Garage', x: 5, y: 5, width: 25, height: 20 },
        'entryway': { name: 'Entryway', x: 30, y: 5, width: 15, height: 15 },
        'living-room': { name: 'Living Room', x: 45, y: 5, width: 35, height: 25 },
        'kitchen': { name: 'Kitchen', x: 30, y: 20, width: 25, height: 20 },
        'bathroom': { name: 'Bathroom', x: 55, y: 30, width: 15, height: 15 },
        'bedroom': { name: 'Bedroom', x: 5, y: 25, width: 25, height: 20 }
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setPeople(prevPeople =>
                prevPeople.map(person => {
                    if (Math.random() < 0.08) {
                        const roomKeys = Object.keys(rooms);
                        const newRoom = roomKeys[Math.floor(Math.random() * roomKeys.length)];
                        const room = rooms[newRoom];
                        return {
                            ...person,
                            room: newRoom,
                            x: room.x + Math.random() * room.width,
                            y: room.y + Math.random() * room.height
                        };
                    }
                    const currentRoom = rooms[person.room];
                    const newX = Math.max(currentRoom.x, Math.min(currentRoom.x + currentRoom.width,
                        person.x + (Math.random() - 0.5) * 1.5));
                    const newY = Math.max(currentRoom.y, Math.min(currentRoom.y + currentRoom.height,
                        person.y + (Math.random() - 0.5) * 1.5));
                    return { ...person, x: newX, y: newY };
                })
            );
        }, 3000);
        return () => clearInterval(moveInterval);
    }, []);

    const getPeopleInRoom = (roomId) => {
        return people.filter(person => person.room === roomId);
    };

    return (
        <div style={{ fontFamily: 'monospace', background: '#fafafa', color: '#111', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
                <h1 style={{ fontWeight: 400, fontSize: 38, marginBottom: 8, marginTop: 0, letterSpacing: 1, textAlign: 'center' }}>House Presence Monitor</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 36, fontSize: 20, marginTop: 0, marginBottom: 18 }}>
                    <span>{people.length} people</span>
                    <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
                    <span>{currentTime.toLocaleDateString('en-US')}</span>
                </div>
                <hr style={{ border: 0, borderTop: '1px solid #e5e7eb', margin: '24px 0 32px 0' }} />

                {/* Legend Section */}
                <div style={{ margin: '0 0 18px 0', fontSize: 15, textAlign: 'center' }}>
                    <span style={{ color: '#888', textTransform: 'uppercase', fontSize: 13, letterSpacing: 1 }}>Legend</span>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 8 }}>
                        {people.map(person => (
                            <div key={person.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <canvas
                                    width={18}
                                    height={18}
                                    style={{ background: 'transparent', border: 'none' }}
                                    ref={el => {
                                        if (el) {
                                            const ctx = el.getContext('2d');
                                            ctx.clearRect(0, 0, 18, 18);
                                            personStyles[person.style](ctx, 18);
                                        }
                                    }}
                                />
                                <span style={{ fontSize: 16 }}>{person.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floor Plan Section */}
                <div style={{ border: '1px solid #e5e7eb', marginBottom: 32, background: '#fcfcfc', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ borderBottom: '1px solid #e5e7eb', padding: '10px 18px', fontSize: 14, color: '#888', letterSpacing: 1, textTransform: 'uppercase', background: '#fafafa' }}>Floor Plan</div>
                    <div style={{ position: 'relative', width: '100%', height: 380, background: '#fff', minWidth: 800 }}>
                        {Object.entries(rooms).map(([roomId, room]) => (
                            <React.Fragment key={roomId}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        border: '1.5px solid #d1d5db',
                                        left: `${room.x}%`,
                                        top: `${room.y}%`,
                                        width: `${room.width}%`,
                                        height: `${room.height}%`,
                                        background: 'rgba(255,255,255,0.97)',
                                        borderRadius: 6
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${room.x + 2}%`,
                                        top: `${room.y + 3}%`,
                                        fontSize: 15,
                                        color: '#888',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {room.name}
                                </div>
                            </React.Fragment>
                        ))}
                        {people.map(person => (
                            <React.Fragment key={person.id}>
                                {/* Name label behind the floorplan */}
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: `calc(${person.x}% + 1.5%)`,
                                    top: `${person.y}%`,
                                    transform: 'translateY(-50%)',
                                    fontSize: 15,
                                    color: '#e0e0e0',
                                    background: 'transparent',
                                    pointerEvents: 'none',
                                    zIndex: 0,
                                    whiteSpace: 'nowrap',
                                    fontWeight: 600,
                                    letterSpacing: 1
                                  }}
                                >
                                  {person.name}
                                </span>
                                {/* Person marker above the floorplan */}
                                <canvas
                                    width={18}
                                    height={18}
                                    style={{
                                        position: 'absolute',
                                        left: `${person.x}%`,
                                        top: `${person.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        pointerEvents: 'auto',
                                        background: 'transparent',
                                        zIndex: 2
                                    }}
                                    ref={el => {
                                        if (el) {
                                            const ctx = el.getContext('2d');
                                            ctx.clearRect(0, 0, 18, 18);
                                            personStyles[person.style](ctx, 18);
                                        }
                                    }}
                                    title={person.name}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* People Table Section */}
                <div style={{ border: '1px solid #e5e7eb', background: '#fcfcfc', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ borderBottom: '1px solid #e5e7eb', padding: '10px 18px', fontSize: 14, color: '#888', letterSpacing: 1, textTransform: 'uppercase', background: '#fafafa', textAlign: 'center' }}>People</div>
                    <table style={{ width: '100%', fontSize: 19, fontFamily: 'monospace', borderCollapse: 'collapse' }}>
                        <tbody>
                            {people.map(person => (
                                <tr key={person.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td style={{ padding: '12px 18px', textAlign: 'left', fontWeight: 400 }}>{person.name}</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', color: '#555' }}>{rooms[person.room]?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HousePresenceVisualizer;