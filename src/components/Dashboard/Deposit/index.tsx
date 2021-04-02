import React, { ChangeEvent, useCallback, useRef, useState } from "react"
import { FaArrowRight } from "react-icons/fa"
import api from "../../../services/api"
import { useDispatch, useSelector } from "react-redux"
import { ApplicationStore } from "../../../store"
import { Contas, Plano } from "../../../types/dash-board"
import { toast } from "react-toastify"
import { Form } from "@unform/web"
import { FormHandles } from "@unform/core"
import * as yup from "yup"

import Input from "../../Input"
import {
  change_screen,
  set_transaction_data,
} from "../../../store/dashboard/actions"
import getValidationErrors from "../../../utils/getValidationErrors"
import Loader from "../../Loader"

import { Container, Card } from "./style"

const Deposit: React.FC = () => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState("")
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState(0)
  const [invoicePayment, setInvoicePayment] = useState(false)
  const store = useSelector((state: ApplicationStore) => state.user)
  const formRef = useRef<FormHandles>(null)

  const handleSubmit = useCallback(
    async (dataProps: Record<string, unknown>) => {
      const date = new Date()
      const referenceDate = new Date(date.setDate(date.getDate() - 1))
      const depositDate = new Date(data)
      const filteredData = data.trim()
      let stopApplication = false

      setLoading(true)
      try {
        formRef.current?.setErrors({})

        if (referenceDate > depositDate || filteredData === "") {
          toast.error("Escolha uma data válida")
          stopApplication = true
        } else if (valor <= 0) {
          toast.error("Valor para transferencia deve ser maior que 0")
          stopApplication = true
        }

        const schema = yup.object().shape({
          date: yup.string().required("Obrigatório data"),
          description: yup
            .string()
            .min(3, "Obrigatório descrição (min. 3 caracteres)"),
          transferValue: yup
            .string()
            .required("Obrigatório transferência (max. 10000)"),
        })

        await schema.validate(dataProps, {
          abortEarly: false,
        })

        if (stopApplication)
          throw new Error("Something went wrong with request")

        const result = await api.get<Contas>(
          `/dashboard?fim=2021-02-22&inicio=2021-02-22&login=${store?.login}`,
          {
            headers: {
              Authorization: store?.token,
            },
          }
        )

        const resultPlan = await api.get<Plano[]>(
          `/lancamentos/planos-conta?login=${store?.login}`,
          {
            headers: {
              Authorization: store?.token,
            },
          }
        )

        const { status } = await api.post(
          "/lancamentos",
          {
            conta: result.data.contaBanco.id,
            data: filteredData,
            descricao: descricao.trim(),
            login: store?.login,
            planoConta: invoicePayment
              ? resultPlan.data[2].id
              : resultPlan.data[0].id,
            valor: valor,
          },
          {
            headers: {
              Authorization: store?.token,
            },
          }
        )

        if (status !== 200)
          throw new Error("Something went wrong with request")

        dispatch(set_transaction_data(undefined))
        dispatch(change_screen("Transações"))

        toast.success(
          invoicePayment ? "Pagamento realizado" : "Depósito realizado"
        )
        clearForm()
      } catch (err) {
        toast.error(
          `Ocorreu algum erro ao tentar realizar o ${
            invoicePayment ? "pagamento" : "depósito"
          }`
        )
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
      } finally {
        setLoading(false)
      }
    },
    [
      data,
      descricao,
      valor,
      store?.login,
      store?.token,
      dispatch,
      invoicePayment,
    ]
  )

  function clearForm() {
    setData("")
    setDescricao("")
    setValor(0)
  }

  const handleChangeValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const numberToAdd = Number(e.target.value)

    if (numberToAdd > 10000) setValor(10000)
    else setValor(numberToAdd)
  }, [])

  return (
    <>
      <Container>
        <Card>
          <div className="container">
            <div className="header-form">
              <p>
                {invoicePayment
                  ? "Realize o pagamento da sua fatura"
                  : "Realize o seu depósito"}
              </p>
            </div>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="date"
                style={{ marginTop: 20 }}
                value={data}
                onChange={(e) => setData(e.target.value)}
                type="date"
              />
              <Input
                name="description"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                type="text"
                placeholder="Descrição"
              />
              <Input
                name="transferValue"
                value={valor ? valor : ""}
                onChange={handleChangeValue}
                type="number"
                placeholder="Valor do depósito"
              />

              {loading ? (
                <Loader />
              ) : (
                <button type="submit" className="button-Deposit">
                  <span>
                    {invoicePayment ? "Pagar agora" : "Depositar agora"}
                  </span>
                </button>
              )}
            </Form>
          </div>
        </Card>
      </Container>
    </>
  )
}

export default Deposit
