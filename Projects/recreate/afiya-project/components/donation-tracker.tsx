'use client'

import { useState, useEffect } from 'react'
import { Plus, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from '@/lib/supabase/client'

type Donor = {
  id: number
  name: string
}

type Donation = {
  id: number
  donor_id: number
  amount: number
  date: string
}

export default function Component() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [newDonorName, setNewDonorName] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const supabase = createClient()

  useEffect(() => {
    fetchDonors()
    fetchDonations()
  }, [])

  async function fetchDonors() {
    const { data, error } = await supabase.from('donors').select('*')
    if (error) console.error('Error fetching donors:', error)
    else setDonors(data || [])
  }

  async function fetchDonations() {
    const { data, error } = await supabase.from('donations').select('*')
    if (error) console.error('Error fetching donations:', error)
    else setDonations(data || [])
  }

  async function addDonor() {
    if (newDonorName.trim() !== '') {
      const { data, error } = await supabase
        .from('donors')
        .insert({ name: newDonorName.trim() })
        .select()
      if (error) console.error('Error adding donor:', error)
      else {
        setDonors([...donors, data[0]])
        setNewDonorName('')
      }
    }
  }

  async function addDonation() {
    if (selectedDonorId && donationAmount) {
      const amount = parseFloat(donationAmount)
      if (!isNaN(amount)) {
        // Create a date on the first day of the selected month
        const donationDate = new Date(selectedYear, selectedMonth + 1, 1)
        
        const { data, error } = await supabase
          .from('donations')
          .insert({
            donor_id: selectedDonorId,
            amount: amount,
            date: donationDate.toISOString().split('T')[0] // This will be the first day of the selected month
          })
          .select()
        
        if (error) {
          console.error('Error adding donation:', error)
        } else {
          setDonations([...donations, data[0]])
          setDonationAmount('')
         }
      }
    }
  }

  async function checkAdminPassword() {
    const { data, error } = await supabase
      .from('admins')
      .select('password')
      .eq('username', 'admin')
      .single()
    
    if (error) {
      console.error('Error checking admin password:', error)
      return false
    }
    
    if (data && data.password === adminPassword) {
      setIsAdmin(true)
      return true
    } else {
      alert('Incorrect admin password')
      return false
    }
  }

  const getMonthlyDonations = () => {
    return donations.filter(donation => {
      const donationDate = new Date(donation.date)
      return donationDate.getMonth() === currentDate.getMonth() &&
             donationDate.getFullYear() === currentDate.getFullYear()
    })
  }

  const monthlyDonations = getMonthlyDonations()
  const totalMonthlyDonations = monthlyDonations.reduce((sum, donation) => sum + donation.amount, 0)
  const totalOverallDonations = donations.reduce((sum, donation) => sum + donation.amount, 0)

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + increment)
    setCurrentDate(newDate)
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-800 text-white p-6">
          <CardTitle className="text-3xl font-bold">Supabase Donation Tracker</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="donors">Donors</TabsTrigger>
              <TabsTrigger value="admin" onClick={() => !isAdmin && setIsAdmin(false)}>
                {isAdmin ? 'Admin' : 'Login'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
                            <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Overall Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 flex items-center justify-center space-x-2">
                    <span>{totalOverallDonations.toFixed(2)} Tk</span>
                  </div>
                  <p className="text-center mt-2 text-gray-600">Total Donations Collected Overall</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 flex items-center justify-center space-x-2">
                    <span>{totalMonthlyDonations.toFixed(2)} Tk</span>
                  </div>
                  <p className="text-center mt-2 text-gray-600">Total Donations This Month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Monthly Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donor</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyDonations.map((donation) => {
                        const donor = donors.find(d => d.id === donation.donor_id)
                        return (
                          <TableRow key={donation.id}>
                            <TableCell>
                      
                              {  donor ? donor.name : 'Unknown'}
                                
                            </TableCell>
                            <TableCell className={
                              `text-right ${isAdmin ? '' : 'filter blur-sm'}`
                            }>{donation.amount.toFixed(2)} Tk</TableCell>
                            <TableCell className="text-right">{new Date(donation.date).toLocaleDateString()}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Donors List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donors.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell>
                            {isAdmin ? (
                              donor.name
                            ) : (
                              <span className="filter blur-sm">{donor.name}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              {!isAdmin ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="adminPassword">Admin Password</Label>
                        <Input 
                          type="password" 
                          id="adminPassword" 
                          value={adminPassword} 
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter admin password"
                        />
                      </div>
                      <Button onClick={checkAdminPassword}>
                        Login
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800">Add New Donor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="newDonorName">Donor Name</Label>
                          <Input 
                            type="text" 
                            id="newDonorName" 
                            value={newDonorName} 
                            onChange={(e) => setNewDonorName(e.target.value)}
                            placeholder="Enter donor name"
                          />
                        </div>
                        <Button onClick={addDonor} variant="secondary">
                          <Plus className="mr-2 h-4 w-4" /> Add Donor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800">Record Donation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="donorSelect">Select Donor</Label>
                          <Select onValueChange={(value) => setSelectedDonorId(Number(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a donor" />
                            </SelectTrigger>
                            <SelectContent>
                              {donors.map(donor => (
                                <SelectItem key={donor.id} value={donor.id.toString()}>{donor.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="donationAmount">Amount (Tk)</Label>
                          <Input 
                            type="number" 
                            id="donationAmount" 
                            value={donationAmount} 
                            onChange={(e) => setDonationAmount(e.target.value)}
                            placeholder="Enter donation amount"
                          />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="donationMonth">Month</Label>
                          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a month" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month, index) => (
                                <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="donationYear">Year</Label>
                          <Input 
                            type="number" 
                            id="donationYear" 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            placeholder="Enter year"
                          />
                        </div>
                        <Button onClick={addDonation}>
                          <CreditCard className="mr-2 h-4 w-4" /> Add Donation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}