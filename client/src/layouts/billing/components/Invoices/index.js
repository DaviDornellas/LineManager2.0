import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Invoice from "layouts/billing/components/Invoice";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function Invoices() {
  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ date: "", id: "", price: "", file: null });
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch("http://192.168.7.65:5000/api/invoices")
      .then((response) => response.json())
      .then((data) => setInvoices(data))
      .catch((error) => console.error("Erro ao buscar faturas:", error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInvoiceData((prevData) => ({ ...prevData, file }));
  };

  const handleSubmit = async () => {
    if (!invoiceData.date || !invoiceData.id || !invoiceData.price || !invoiceData.file) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const formData = new FormData();
    formData.append("date", invoiceData.date);
    formData.append("invoiceId", invoiceData.id);
    formData.append("price", invoiceData.price);
    formData.append("file", invoiceData.file);

    try {
      const response = await fetch("http://192.168.7.65:5000/api/invoices", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao adicionar fatura.");

      const result = await response.json();
      alert(result.message);
      setInvoices([...invoices, { ...invoiceData, filePath: result.filePath }]);
      setOpen(false);
      setInvoiceData({ date: "", id: "", price: "", file: null });
    } catch (error) {
      console.error("Erro ao enviar fatura:", error);
    }
  };

  return (
    <>
      <Card sx={{ height: "100%" }}>
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Faturas
          </MDTypography>
          <MDButton variant="outlined" color="info" size="small" onClick={handleClickOpen}>
            Adicionar
          </MDButton>
        </MDBox>
        <MDBox p={2}>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {invoices.map((invoice, index) => (
              <Invoice
                key={index}
                date={formatDate(invoice.date)}
                id={invoice.invoiceId}
                price={invoice.price}
              >
                {invoice.filePath && (
                  <a href={`http://192.168.7.65:5000/${invoice.filePath}`} download>
                    <PictureAsPdfIcon
                      color="error"
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                    />
                  </a>
                )}
              </Invoice>
            ))}
          </MDBox>
        </MDBox>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Fatura</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Data"
            type="date"
            fullWidth
            variant="outlined"
            name="date"
            value={invoiceData.date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="ID"
            type="text"
            fullWidth
            variant="outlined"
            name="id"
            value={invoiceData.id}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Preço"
            type="text"
            fullWidth
            variant="outlined"
            name="price"
            value={invoiceData.price}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            style={{ marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Invoices;
